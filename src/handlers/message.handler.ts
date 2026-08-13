import { handleConversation } from "@/services/conversation.service";
import { WhatsAppWebhook } from "@/types/whatsapp";
import {
  createCustomerOrderToken,
  buildCustomerOrderUrl,
} from "@/services/order-link.service";
import { sendTextMessage } from "@/services/whatsapp.service";

export async function handleIncomingMessage(
  body: WhatsAppWebhook
) {
  try {
    const value = body.entry?.[0]?.changes?.[0]?.value;

    if (!value?.messages || value.messages.length === 0) {
      console.log("No incoming messages.");
      return;
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];

    const phone = message.from;
    const text =
      message.type === "text"
        ? message.text.body.trim()
        : "";

    const name =
      contact?.profile?.name || "Customer";

    console.log("📩 New Message");
    console.log("👤 Name:", name);
    console.log("📞 Phone:", phone);
    console.log("💬 Message:", text);

    // ==========================================
    // MENU REQUEST
    // ==========================================

    if (text.toUpperCase() === "MENU") {
      console.log("🛒 MENU requested");

      const token =
        await createCustomerOrderToken(phone);

      const orderUrl =
        buildCustomerOrderUrl(token);

      const messageText = `🥚 *PRIME PROTEINS MENU*

🛒 *Place your order online*

Browse our products, select quantity and place your order easily.

👇 *Order Here*

${orderUrl}

⏰ This link is valid for 24 hours.`;

      await sendTextMessage(
        phone,
        messageText
      );

      console.log(
        "✅ Customer order link sent"
      );

      return;
    }

    // ==========================================
    // OTHER MESSAGES
    // ==========================================

    await handleConversation(
      phone,
      text
    );
  } catch (error) {
    console.error(
      "❌ Error handling message:",
      error
    );
  }
}