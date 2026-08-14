import {
  NextRequest,
  NextResponse,
} from "next/server";

export function middleware(
  request: NextRequest
) {
  const { pathname } =
    request.nextUrl;

  const session =
    request.cookies.get("session")
      ?.value;

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/order" ||
    pathname.startsWith(
      "/api/webhook"
    );

  if (isPublicRoute) {
    // Logged-in admin visiting /login
    // can be redirected to dashboard.
    if (
      pathname === "/login" &&
      session
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard",
          request.url
        )
      );
    }

    return NextResponse.next();
  }

  // ==========================================
  // DASHBOARD PROTECTION
  // ==========================================

  if (
    pathname.startsWith(
      "/dashboard"
    )
  ) {
    if (!session) {
      const loginUrl =
        new URL(
          "/login",
          request.url
        );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(
        loginUrl
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/order",
    "/api/webhook/:path*",
  ],
};