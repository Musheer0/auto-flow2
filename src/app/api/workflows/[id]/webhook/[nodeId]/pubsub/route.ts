// app/api/webhooks/youtube/route.ts

import { workflowDataSchema } from "@/features/editor/schemas/workflow-schema";
import { NodeData, WebhookData } from "@/features/editor/types";
import { inngest } from "@/inngest/client";
import { decrypt } from "@/lib/encrypt-decrypt";
import { getCredentialById } from "@/trpc/utils/get-credential-by-id";
import { getWorkflowByid } from "@/trpc/utils/get-workflow-by-id";

import { NextRequest, NextResponse } from "next/server";
import { verifyYoutubePubSub } from "../../../../../youtube/pubsubhub/_helpers/verify-subcribe";
import z from "zod";
import { YoutubePubSubSchema } from "@/features/editor/schemas/youtube-pubsubhubhub-schema";
import crypto from "crypto";
import { XMLParser } from "fast-xml-parser";

export async function GET(req: NextRequest) {
  const verification = verifyYoutubePubSub(req, {});

  if (verification) return verification;

  return NextResponse.json({ ok: true });
}

function isValidSignature(rawBody: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader) return false;

  // header format: "sha1=abcdef123..."
  const [algo, signature] = signatureHeader.split("=");
  if (algo !== "sha1" || !signature) return false;

  const expected = crypto
    .createHmac("sha1", secret)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  // lengths must match before timingSafeEqual, otherwise it throws
  if (expectedBuffer.length !== signatureBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

function parseYouTubeFeed(xml: string) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const parsed = parser.parse(xml);

  const entry = parsed?.feed?.entry;
  if (!entry) return null;

  return {
    videoId: entry["yt:videoId"],
    channelId: entry["yt:channelId"],
    title: entry.title,
    link: entry.link?.["@_href"],
    published: entry.published,
    updated: entry.updated,
  };
}

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string; nodeId: string }> }
) => {
  const header = req.headers;
  const wh_secret = header.get("x-webhook-secret") || "";
  const signatureHeader = header.get("x-hub-signature");
  const { id, nodeId } = await params;

  const workflow = await getWorkflowByid(id);
  if (!workflow) return NextResponse.json({}, { status: 404 });

  const workflow_data = workflowDataSchema.safeParse(JSON.parse(workflow.data));
  if (workflow_data.error)
    return NextResponse.json({ ...workflow_data.error }, { status: 400 });

  const nodes = workflow_data.data.nodes;
  const pubsub_node = nodes.find((n) => n.type === "PUBSUBHUBBUB" && n.id == nodeId);
  if (!pubsub_node) return NextResponse.json({ error: "node not found" }, { status: 400 });

  const node_data = pubsub_node.data as NodeData<z.infer<typeof YoutubePubSubSchema>>;
  if (!node_data?.user_data || !node_data?.user_data?.verify_secret)
    return NextResponse.json(null);

  const secret = decrypt(node_data.user_data.verify_secret);

  // raw text MUST be read before any signature check, and used as-is (no re-serialization)
  const xml = await req.text();

  const isValid = isValidSignature(xml, signatureHeader, secret);
  if (!isValid) {
    return NextResponse.json({ error: "invalid signature" }, { status: 403 });
  }

  const videoData = parseYouTubeFeed(xml);
  if (!videoData) {
    // YouTube also sends "deleted-entry" notifications; nothing to process
    return NextResponse.json({ ok: true });
  }

  await inngest.send({
    name: "app/workflow.started",
    data: {
      workflow,
      triggerNodeId: pubsub_node.id,
      trigger_data: videoData,
      body:videoData
    },
  });

  return NextResponse.json({ ok: true });
};