import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set(["/login", "/register"]);

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token")?.value;

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  const isPublicPage = PUBLIC_ROUTES.has(request.nextUrl.pathname);

  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
