// src/middleware.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

export function middleware(
  request: NextRequest
) {
  const { pathname, searchParams } =
    request.nextUrl;

  const session =
    request.cookies.get("session")?.value;

  // ==========================================
  // CUSTOMER ORDER PAGE
  // ==========================================

  if (pathname === "/order") {
    const token =
      searchParams.get("token");

    // /order without token
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    // Token exists.
    // Allow the order page to load.
    // Your server page will validate
    // the token against Firestore.
    return NextResponse.next();
  }

  // ==========================================
  // LOGIN PAGE
  // ==========================================

  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    return NextResponse.next();
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  if (
    pathname.startsWith("/dashboard")
  ) {
    if (!session) {
      const loginUrl =
        new URL("/login", request.url);

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(
        loginUrl
      );
    }
  }

  // ==========================================
  // EVERYTHING ELSE
  // ==========================================

  if (!session) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};