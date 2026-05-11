import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  AUTH_REDIRECT_PARAM,
  DEFAULT_AUTH_REDIRECT_PATH,
  getSafeAuthRedirectPath,
} from "@/lib/auth-redirect";

function hasBetterAuthSessionCookie(request: NextRequest) {
  return (
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token") ||
    request.cookies.has("better-auth-session_token") ||
    request.cookies.has("__Secure-better-auth-session_token")
  );
}

export function proxy(request: NextRequest) {
  if (hasBetterAuthSessionCookie(request)) {
    return NextResponse.next();
  }

  const requestedPath = getSafeAuthRedirectPath(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    DEFAULT_AUTH_REDIRECT_PATH,
  );
  const loginUrl = new URL("/login", request.url);

  loginUrl.searchParams.set(AUTH_REDIRECT_PARAM, requestedPath);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/project-definitions/:path*",
    "/ide-sessions/:path*",
    "/submissions/:path*",
  ],
};
