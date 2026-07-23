// src/app/api/send-test/route.ts

import { NextResponse } from "next/server";
import { sendTextMessage } from "@/services/whatsapp.service";

export async function GET() {
  try {
    // Replace with your WhatsApp number (including country code, no +)
    const phone = "918261040814";

    const result = await sendTextMessage(
      phone,
      "🎉 Hello from your WhatsApp Automation!\n\nYour application is successfully connected to the WhatsApp Cloud API."
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}