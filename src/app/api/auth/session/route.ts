import { NextRequest, NextResponse } from "next/server";

import { adminAuth } from "@/lib/firebase/admin";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json(
        {
          message: "ID token is required.",
        },
        { status: 400 }
      );
    }

    // Verify Firebase ID token
    const decodedToken =
      await adminAuth.verifyIdToken(
        idToken
      );

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      "session",
      idToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 5,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Session creation error:",
      error
    );

    return NextResponse.json(
      {
        message: "Unauthorized.",
      },
      { status: 401 }
    );
  }
}