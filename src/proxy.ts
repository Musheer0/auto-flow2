// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const authRoutes = [
  "/auth/google/sign-in",
  "/auth/callback/google",
];

const protectedRoutes = [
  "/auth/logout",
  "/credentials",
  "/workflows",
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const session = req.cookies.get("autoflow-session")?.value;
  const isLoggedIn = Boolean(session);

  // Redirect unauthenticated users
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Prevent logged-in users from visiting auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/workflows", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};