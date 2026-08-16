import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { message: "ID token is required." },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token first
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Optional but recommended:
    // Only create a session for a recently authenticated user.
    const authTime = decodedToken.auth_time;
    const now = Math.floor(Date.now() / 1000);

    if (!authTime || now - authTime > 5 * 60) {
      return NextResponse.json(
        { message: "Recent sign-in required." },
        { status: 401 }
      );
    }

    // Create a real Firebase session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const sessionCookie = await adminAuth.createSessionCookie(
      idToken,
      { expiresIn }
    );

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 5,
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);

    return NextResponse.json(
      { message: "Unauthorized." },
      { status: 401 }
    );
  }
}