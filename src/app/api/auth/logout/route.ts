import { cookie_name } from "@/constants";
import prisma from "@/db";
import { verifyJwt } from "@/libs/jwt";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  const session = req.cookies.get(cookie_name)?.value;
  const isLoggedIn = !!session;
  if (!isLoggedIn)
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  const jwt = verifyJwt(session);
  await prisma.session.delete({ where: { id: jwt.sessionId } });
  const res = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  res.cookies.delete(cookie_name);
  return res;
};
