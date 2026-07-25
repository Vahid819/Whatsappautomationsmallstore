import { handleConversation } from "@/services/conversation.service";
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

    await handleConversation(phone, text);
  } catch (error) {
    console.error("❌ Error handling message:", error);
  }
}