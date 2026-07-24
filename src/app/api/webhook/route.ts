import { NextRequest } from "next/server";
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
  const body: WhatsAppWebhook = await req.json();

  console.log("🔥 WEBHOOK HIT");
  console.log(JSON.stringify(body, null, 2));

  const value = body.entry?.[0]?.changes?.[0]?.value;

  // Handle incoming customer messages
  if (value?.messages?.length) {
    await handleIncomingMessage(body);
    return Response.json({ success: true });
  }

  // Handle status updates (sent, delivered, read)
  if (value?.statuses?.length) {
    console.log(`📨 Message Status: ${value.statuses[0].status}`);
    return Response.json({ success: true });
  }

  console.log("Unknown webhook event.");
  return Response.json({ success: true });
}