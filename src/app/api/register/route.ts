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
    console.log("========== REGISTER API ==========");

    const body = await request.json();
    console.log("Request Body:", body);

    // Check token
    if (!body.token) {
      console.log("❌ Token missing");

      return NextResponse.json(
        {
          success: false,
          message: "Token is required",
        },
        { status: 400 }
      );
    }

    // Verify token
    const registration = await verifyRegistrationToken(body.token);

    console.log("Registration Token:", registration);

    if (!registration) {
      console.log("❌ Invalid token");

      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 400 }
      );
    }

    // Validate form data
    const result = customerSchema.safeParse(body);

    if (!result.success) {
      console.log("❌ Validation Failed");
      console.log(result.error.flatten());

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const phone = registration.phone;

    console.log("Phone:", phone);

    // Already registered?
    const customer = await getCustomer(phone);

    console.log("Existing Customer:", customer);

    if (customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer already registered",
        },
        { status: 409 }
      );
    }

    console.log("Creating Customer...");

    await createCustomer({
      phone,
      mobile: phone,

      name: result.data.name,
      address: result.data.address,
      landmark: result.data.landmark,
      instructions: result.data.instructions,
    });

    console.log("✅ Customer Created");

    await deleteRegistrationToken(body.token);

    console.log("✅ Token Deleted");

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
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}