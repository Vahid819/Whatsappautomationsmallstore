// src/services/conversation.service.ts

import { ConversationState } from "@/types/conversation";
import { OrderItem } from "@/types/order";

import { generateRegistrationToken } from "./registration-token.service";

import {
  getCustomer,
  updateCustomer,
} from "./customer.service";

import {
  getMenuMessage,
  getMenuItemByNumber,
} from "./menu.service";

import { parseOrderMessage } from "./order-parser.service";

import { createOrder } from "./order.service";

import { sendTextMessage } from "./whatsapp.service";

export async function handleConversation(
  phone: string,
  message: string
) {
  const customer = await getCustomer(phone);

  // ===============================
  // New Customer
  // ===============================

  if (!customer) {
    const token = await generateRegistrationToken(phone);

    const registerUrl =
      `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}`;

    await sendTextMessage(
      phone,
      `👋 Welcome to *Prime Proteins*

Before placing your first order, please complete your registration.

📝 Register Here
${registerUrl}

After registration send *MENU* to begin ordering.`
    );

    return;
  }

  const text = message.trim().toLowerCase();

  switch (customer.state) {

    // ===========================================
    // Registered Customer
    // ===========================================

    case ConversationState.REGISTERED: {

      if (
        text === "hi" ||
        text === "hello" ||
        text === "menu" ||
        text === "start"
      ) {

        const menu = await getMenuMessage();

        await updateCustomer(phone, {
          state: ConversationState.WAITING_MENU_SELECTION,
        });

        await sendTextMessage(phone, menu);

        break;
      }

      await sendTextMessage(
        phone,
        "👋 Send *MENU* to view today's products."
      );

      break;
    }

    // ===========================================
    // Waiting for Order
    // ===========================================

    case ConversationState.WAITING_MENU_SELECTION: {

      if (
        text === "menu" ||
        text === "hi" ||
        text === "hello" ||
        text === "start"
      ) {

        const menu = await getMenuMessage();

        await sendTextMessage(phone, menu);

        break;
      }

      const parsedItems = parseOrderMessage(message);

      if (parsedItems.length === 0) {

        await sendTextMessage(
          phone,
          `❌ Invalid format.

Example:

1 x2
4 x1
8 x3`
        );

        break;
      }

      const cart: OrderItem[] = [];

      let subtotal = 0;
            // ===========================================
      // Build Cart
      // ===========================================

      for (const item of parsedItems) {
        const product = await getMenuItemByNumber(
          item.productNumber
        );

        if (!product) {
          await sendTextMessage(
            phone,
            `❌ Product number ${item.productNumber} was not found.

Please send *MENU* to view the latest menu.`
          );

          return;
        }

        const total = product.price * item.quantity;

        subtotal += total;

        cart.push({
          productId: product.id,
          productNumber: product.productNumber,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          total,
        });
      }

      // ===========================================
      // Save Cart
      // ===========================================

      const savedCustomer = await getCustomer(phone);
      
      await updateCustomer(phone, {
        cart,
        state: ConversationState.WAITING_CONFIRMATION,
      });

      // ===========================================
      // Generate Summary
      // ===========================================

      let summary = `🛒 *Order Summary*\n\n`;

      cart.forEach((item) => {
        summary +=
          `📦 ${item.name}\n` +
          `Qty : ${item.quantity}\n` +
          `Price : ₹${item.price}\n` +
          `Total : ₹${item.total}\n\n`;
      });

      summary +=
        `━━━━━━━━━━━━━━━\n` +
        `💰 *Grand Total : ₹${subtotal}*\n\n` +
        `Reply:\n\n` +
        `✅ YES - Confirm Order\n` +
        `❌ NO - Cancel Order`;

      await sendTextMessage(phone, summary);

      break;
    }

    // ===========================================
    // Waiting For Confirmation
    // ===========================================

    case ConversationState.WAITING_CONFIRMATION: {

      const reply = text;
            if (reply === "yes") {

        const latestCustomer = await getCustomer(phone);

        if (!latestCustomer) {
          await sendTextMessage(
            phone,
            "❌ Customer not found."
          );
          break;
        }

        if (
          !latestCustomer.cart ||
          latestCustomer.cart.length === 0
        ) {
          await sendTextMessage(
            phone,
            "❌ Your cart is empty.\n\nPlease send *MENU* to order again."
          );

          await updateCustomer(phone, {
            state: ConversationState.REGISTERED,
          });

          break;
        }

        const subtotal = latestCustomer.cart.reduce(
          (sum, item) => sum + item.total,
          0
        );


        const orderId = await createOrder({
          customerId: latestCustomer.phone,

          customerPhone: latestCustomer.phone,
          customerName: latestCustomer.name,

          customerAddress: latestCustomer.address,
          customerLandmark: latestCustomer.landmark,
          customerInstructions:
            latestCustomer.instructions,

          items: latestCustomer.cart,

          subtotal,

          deliveryCharge: 0,

          discount: 0,

          totalAmount: subtotal,

          paymentMethod: "COD",

          paymentStatus: "PENDING",

          status: "PENDING",
        });

        let itemsText = "";

        latestCustomer.cart.forEach((item) => {
          itemsText +=
            `• ${item.name}\n` +
            `Qty : ${item.quantity}\n` +
            `₹${item.total}\n\n`;
        });

        await updateCustomer(phone, {
          cart: [],
          state: ConversationState.REGISTERED,
        });

        await sendTextMessage(
          phone,
          `🎉 *Order Confirmed*

🆔 Order ID
${orderId}

${itemsText}
━━━━━━━━━━━━━━━

💰 Total : ₹${subtotal}

💳 Payment : Cash on Delivery

📦 Status : Pending

Thank you for choosing *Prime Proteins* ❤️

We have received your order and will start preparing it shortly.`
        );

        break;
      }

      if (reply === "no") {

        await updateCustomer(phone, {
          cart: [],
          state:
            ConversationState.WAITING_MENU_SELECTION,
        });

        const menu = await getMenuMessage();

        await sendTextMessage(
          phone,
          `❌ Order Cancelled.

${menu}`
        );

        break;
      }

      await sendTextMessage(
        phone,
        `Please reply with:

✅ YES

or

❌ NO`
      );

      break;
    }

    default: {

      await updateCustomer(phone, {
        state: ConversationState.REGISTERED,
      });

      await sendTextMessage(
        phone,
        "❌ Something went wrong.\n\nPlease send *MENU* to start again."
      );

      break;
    }
  }
}