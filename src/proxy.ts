// proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const session = req.cookies.get("autoflow-session")?.value;
  const isLoggedIn = !!session
  console.log("Session:", isLoggedIn);

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};