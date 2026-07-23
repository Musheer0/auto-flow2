// lib/youtube/verify-pubsub.ts

import { NextRequest, NextResponse } from "next/server";

export interface VerifyYoutubePubSubOptions {
  /**
   * Expected YouTube channel ID.
   * If omitted, topic validation is skipped.
   */
  channelId?: string;
}

export function verifyYoutubePubSub(
  req: NextRequest,
  options: VerifyYoutubePubSubOptions = {},
): NextResponse | null {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const topic = searchParams.get("hub.topic");
  const challenge = searchParams.get("hub.challenge");

  if (!mode || !topic || !challenge) {
    return NextResponse.json(
      { error: "Missing verification parameters" },
      { status: 400 },
    );
  }

  if (mode !== "subscribe" && mode !== "unsubscribe") {
    return NextResponse.json(
      { error: "Invalid hub.mode" },
      { status: 400 },
    );
  }

  return new NextResponse(challenge, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}