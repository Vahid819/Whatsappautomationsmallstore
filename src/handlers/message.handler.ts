// src/handlers/message.handler.ts

import { saveCustomer } from "@/services/customer.service";
import { sendTextMessage } from "@/services/whatsapp.service";
import { WhatsAppWebhook } from "@/types/whatsapp";

export async function handleIncomingMessage(body: WhatsAppWebhook) {
  try {
    const value = body.entry?.[0]?.changes?.[0]?.value;

    if (!value?.messages || value.messages.length === 0) {
      console.log("No incoming messages.");
      return;
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];

    const phone = message.from;
    const text = message.type === "text" ? message.text.body : "";
    const name = contact?.profile?.name || "Customer";

    console.log("📩 New Message");
    console.log("👤 Name:", name);
    console.log("📞 Phone:", phone);
    console.log("💬 Message:", text);

    // Save customer to Firestore
    await saveCustomer({
      phone,
      name,
      lastMessage: text,
    });

    // Auto reply
    await sendTextMessage(
      phone,
      `👋 Hello ${name}!

Welcome to MominEgg 🥚

Thank you for contacting us.
How can we help you today?`
    );

    console.log("✅ Auto reply sent");
  } catch (error) {
    console.error("❌ Error handling message:", error);
  }
}