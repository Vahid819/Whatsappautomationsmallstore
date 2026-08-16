import { NextRequest, NextResponse } from "next/server";

import { customerSchema } from "@/schemas/customer.schema";

import {
  createCustomer,
  getCustomer,
} from "@/services/customer.service";

import {
  verifyRegistrationToken,
  deleteRegistrationToken,
} from "@/services/registration-token.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ==========================================
    // TOKEN REQUIRED
    // ==========================================

    if (!body.token) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration token is required",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    const registration = await verifyRegistrationToken(
      body.token
    );

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration link is invalid or expired",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // VALIDATE CUSTOMER DATA
    // ==========================================

    const result = customerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your information",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    // ==========================================
    // GET PHONE FROM VERIFIED TOKEN
    // ==========================================

    const phone = registration.phone;

    // ==========================================
    // CHECK EXISTING CUSTOMER
    // ==========================================

    const existingCustomer = await getCustomer(phone);

    if (existingCustomer) {
      // Token is no longer useful
      await deleteRegistrationToken(body.token);

      return NextResponse.json(
        {
          success: false,
          message: "Customer is already registered",
        },
        { status: 409 }
      );
    }

    // ==========================================
    // CREATE CUSTOMER
    // ==========================================

    await createCustomer({
      phone,
      mobile: phone,

      name: result.data.name,
      address: result.data.address,
      landmark: result.data.landmark,
      instructions: result.data.instructions,
    });

    // ==========================================
    // DELETE TOKEN AFTER SUCCESS
    // ==========================================

    await deleteRegistrationToken(body.token);

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message: "Registration completed successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}