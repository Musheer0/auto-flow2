import { oauth2googleClient } from "@/features/google-oauth/client";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { google } from "googleapis";
import prisma from "@/db";
import { user } from "@/generated/prisma/client";
import { createJwt, expiresAt } from "@/libs/jwt";

export const GET = async (req: NextRequest) => {
  const s = new URLSearchParams(req.url);
  const code = s.get("code");
  if (!code)
    return NextResponse.json({ error: "code not found" }, { status: 400 });
  const { tokens } = await oauth2googleClient.getToken(code);
  oauth2googleClient.setCredentials(tokens);
  const oauth2 = google.oauth2({
    version: "v2",
    auth: oauth2googleClient,
  });
  const { data } = await oauth2.userinfo.get();
  if (!data)
    return NextResponse.json(
      { error: "error getting user info" },
      { status: 400 },
    );
  const isNewUser = !!tokens.refresh_token;
  let user: user | null = null;
  if (!data.email && !data.name)
    return NextResponse.json(
      { error: "missing required data" },
      { status: 400 },
    );
  if (isNewUser) {
    try {
      user = await prisma.user.create({
        data: {
          email: data.email!,
          name: data.name!,
          picture: data.picture,
          accounts: {
            create: {
              expires_at: new Date(tokens.expiry_date!),
              refresh_token: tokens.refresh_token!,
              scope: tokens.scope!,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      user = await prisma.user.findFirst({
        where: {
          email: data.email!,
        },
      });
      if (!user)
        return NextResponse.json(
          { error: "error creating user" },
          { status: 500 },
        );
    }
  } else {
    user = await prisma.user.findFirst({
      where: {
        email: data.email!,
      },
    });
  }
  if (!user)
    return NextResponse.json({ error: "user not found" }, { status: 403 });
  const ua = userAgent(req);
  const expDate = expiresAt;
  const session = await prisma.session.create({
    data: {
      user_id: user.id,
      expires_at: expDate,
      ua: JSON.stringify(ua) || "{}",
    },
  });
  const token = createJwt({ userId: user.id, sessionId: session.id });
  const response = NextResponse.redirect(
    new URL(isNewUser ? "/onboard" : "/workflows", req.nextUrl.origin),
  );
  response.cookies.set("autoflow-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expDate, // 7 days
  });

  return response;
};
