import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = new Set(["/login", "/register", "/"]);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("jwt_token")?.value;
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isPublicPage = PUBLIC_ROUTES.has(request.nextUrl.pathname);

  let isValidSession = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  if (!isValidSession && !isPublicPage) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("jwt_token");
    return response;
  }

  if (isValidSession && isAuthPage) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
