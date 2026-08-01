import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationToken } from "@/services/registration-token.service";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token is required",
        },
        {
          status: 400,
        }
      );
    }

    const registration = await verifyRegistrationToken(token);

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        phone: registration.phone,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Verify Token Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}