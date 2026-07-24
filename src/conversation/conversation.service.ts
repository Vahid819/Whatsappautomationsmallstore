import { sendTextMessage } from "@/services/whatsapp.service";
import {
  createCustomer,
  getCustomer,
  updateCustomer,
} from "@/services/customer.service";
import { ConversationState } from "@/types/conversation";

export async function handleConversation(
  phone: string,
  message: string
) {
  const customer = await getCustomer(phone);

  // First time customer
  if (!customer) {
    await createCustomer(phone, "", ConversationState.WAITING_NAME);

    await sendTextMessage(
      phone,
      `👋 Welcome to MominEgg!

Before placing your order, let's get your details.

What is your full name?`
    );

    return;
  }

  switch (customer.state) {
    case ConversationState.WAITING_NAME:
      await updateCustomer(phone, {
        name: message,
        state: ConversationState.WAITING_ADDRESS,
      });

      await sendTextMessage(
        phone,
        "📍 Please enter your delivery address."
      );
      break;

    case ConversationState.WAITING_ADDRESS:
      await updateCustomer(phone, {
        address: message,
        state: ConversationState.WAITING_PHONE,
      });

      await sendTextMessage(
        phone,
        "📞 Please enter your mobile number."
      );
      break;

    case ConversationState.WAITING_PHONE:
      await updateCustomer(phone, {
        mobile: message,
        state: ConversationState.REGISTERED,
      });

      await sendTextMessage(
        phone,
        `✅ Thank you!

Your details have been saved successfully.

🍳 Here's our menu:

1️⃣ Egg Curry - ₹120
2️⃣ Omelette - ₹70
3️⃣ Boiled Eggs - ₹40

Reply with the item number to order.`
      );
      break;

    case ConversationState.REGISTERED:
      await sendTextMessage(
        phone,
        "🍽️ Menu handling will be implemented in the next step."
      );
      break;

    default:
      break;
  }
}