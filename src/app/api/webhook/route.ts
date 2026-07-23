
import { NextResponse, NextRequest } from "next/server";
import { handleIncomingMessage } from "@/handlers/message.handler";
import { WhatsAppWebhook } from "@/types/whatsapp";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body: WhatsAppWebhook = await req.json();

    console.log("========== NEW WEBHOOK ==========");
    console.log(JSON.stringify(body, null, 2));

    await handleIncomingMessage(body);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Webhook Error:", error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}