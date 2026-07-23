// app/api/webhooks/youtube/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyYoutubePubSub } from "../../../../../youtube/pubsubhub/_helpers/verify-subcribe";

export async function GET(req: NextRequest) {
  const verification = verifyYoutubePubSub(req, {});

  if (verification) return verification;

  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const xml = await req.text();

  // Handle notification...

  return new NextResponse(null, { status: 204 });
}
