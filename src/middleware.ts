import {
  NextRequest,
  NextResponse,
} from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const session = request.cookies.get("session")?.value;

  // ==========================================
  // PUBLIC API ROUTES
  // ==========================================

  if (
    pathname.startsWith("/api/auth/") ||
    pathname === "/api/register" ||
    pathname.startsWith("/api/webhook")
  ) {
    return NextResponse.next();
  }

  // ==========================================
  // PUBLIC PAGES
  // ==========================================

  if (pathname === "/success") {
    return NextResponse.next();
  }

  // ==========================================
  // PUBLIC CUSTOMER REGISTRATION
  // ==========================================

  if (pathname === "/register") {
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    return NextResponse.next();
  }

  // ==========================================
  // CUSTOMER ORDER PAGE
  // ==========================================

  if (pathname === "/order") {
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

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

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL(
        "/login",
        request.url
      );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
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