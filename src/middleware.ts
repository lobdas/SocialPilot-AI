import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const authToken = request.cookies.get("socialpilot_auth_token")?.value;
  const isAuthenticated = !!authToken;

  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/app");
  const isAuthPath = pathname === "/login" || pathname === "/register";

  // If attempting to access protected route without token, redirect to login
  if (isProtectedPath && !isAuthenticated) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(redirectUrl);
  }

  // If already authenticated and visiting login/register, redirect to dashboard
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/app/:path*",
    "/app",
    "/login",
    "/register",
  ],
};
