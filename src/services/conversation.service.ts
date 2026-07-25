// src/services/conversation.service.ts

import {
    createCustomer,
    getCustomer,
    updateCustomer,
} from "./customer.service";

import {
    getMenuMessage,
    getMenuItemByNumber,
} from "./menu.service";

import { sendTextMessage } from "./whatsapp.service";
import { ConversationState } from "@/types/conversation";

export async function handleConversation(
    phone: string,
    message: string
) {
    // Check if customer exists
    const customer = await getCustomer(phone);

    // First-time customer
    if (!customer) {
        await createCustomer(phone);

        await sendTextMessage(
            phone,
            `👋 Welcome to MominEgg 🥚

Before ordering, I need a few details.

😊 What is your full name?`
        );

        return;
    }

    switch (customer.state) {
        // ===========================
        // Ask Name
        // ===========================
        case ConversationState.WAITING_NAME:
            await updateCustomer(phone, {
                name: message,
                state: ConversationState.WAITING_ADDRESS,
            });

            await sendTextMessage(
                phone,
                `📍 Thanks ${message}!

Please enter your delivery address.`
            );
            break;

        // ===========================
        // Ask Address
        // ===========================
        case ConversationState.WAITING_ADDRESS:
            await updateCustomer(phone, {
                address: message,
                state: ConversationState.WAITING_PHONE,
            });

            await sendTextMessage(
                phone,
                `📞 Please enter your mobile number.`
            );
            break;

        // ===========================
        // Ask Phone & Show Menu
        // ===========================
        case ConversationState.WAITING_PHONE: {
            const menu = await getMenuMessage();

            await updateCustomer(phone, {
                mobile: message,
                state: ConversationState.WAITING_MENU_SELECTION,
            });

            await sendTextMessage(
                phone,
                `✅ Registration completed successfully!

${menu}`
            );
            break;
        }

        // ===========================
        // Registered Customer
        // ===========================
        case ConversationState.REGISTERED: {
            const text = message.trim().toLowerCase();

            if (["menu", "hi", "hello", "start"].includes(text)) {
                const menu = await getMenuMessage();

                await updateCustomer(phone, {
                    state: ConversationState.WAITING_MENU_SELECTION,
                });

                await sendTextMessage(phone, menu);
                break;
            }

            await sendTextMessage(
                phone,
                '👋 Type *menu* to see our products.'
            );
            break;
        }

        // ===========================
        // Menu Selection
        // ===========================
        case ConversationState.WAITING_MENU_SELECTION: {
            const text = message.trim().toLowerCase();

            // Show menu again
            if (["menu", "hi", "hello", "start"].includes(text)) {
                const menu = await getMenuMessage();

                await sendTextMessage(phone, menu);
                break;
            }

            const itemNumber = Number(text);

            if (isNaN(itemNumber)) {
                await sendTextMessage(
                    phone,
                    "❌ Please reply with a valid product number.\n\nType *menu* to see the menu again."
                );
                break;
            }

            const menuItem = await getMenuItemByNumber(itemNumber);

            if (!menuItem) {
                await sendTextMessage(
                    phone,
                    "❌ Product not found.\n\nType *menu* to see the latest menu."
                );
                break;
            }

            await updateCustomer(phone, {
                selectedItemId: menuItem.id,
                selectedItemName: menuItem.name,
                selectedItemPrice: menuItem.price,
                state: ConversationState.WAITING_QUANTITY,
            });

            await sendTextMessage(
                phone,
                `🛒 *${menuItem.name}*

💰 Price: ₹${menuItem.price}

📦 How many would you like to order?`
            );

            break;
        }

        // ===========================
        // Quantity (Next Step)
        // ===========================
        case ConversationState.WAITING_QUANTITY: {
            const quantity = Number(message);

            if (!Number.isInteger(quantity) || quantity <= 0) {
                await sendTextMessage(
                    phone,
                    "❌ Please enter a valid quantity.\n\nExample: 2"
                );
                break;
            }

            const total = quantity * (customer.selectedItemPrice ?? 0);

            await updateCustomer(phone, {
                quantity: quantity,
                state: ConversationState.WAITING_CONFIRMATION,
            });

            await sendTextMessage(
                phone,
                `🛒 *Order Summary*

📦 Product: ${customer.selectedItemName}
🔢 Quantity: ${quantity}
💰 Price: ₹${customer.selectedItemPrice}
💵 Total: ₹${total}

Reply with:

✅ YES - Confirm Order
❌ NO - Cancel Order`
            );

            break;
        }

        case ConversationState.WAITING_CONFIRMATION: {
  const reply = message.trim().toLowerCase();

  if (reply === "yes") {
    await sendTextMessage(
      phone,
      "🎉 Your order has been confirmed.\n\nThank you for ordering!"
    );

    await updateCustomer(phone, {
      state: ConversationState.REGISTERED,
      selectedItemId: "",
      selectedItemName: "",
      selectedItemPrice: 0,
      quantity: 0,
    });

    break;
  }

  if (reply === "no") {
    await updateCustomer(phone, {
      state: ConversationState.WAITING_MENU_SELECTION,
    });

    const menu = await getMenuMessage();

    await sendTextMessage(
      phone,
      `❌ Order cancelled.\n\n${menu}`
    );

    break;
  }

  await sendTextMessage(
    phone,
    "Please reply with YES or NO."
  );

  break;
}

        default:
            await sendTextMessage(
                phone,
                "❌ Something went wrong. Please type Hi to start again."
            );
    }
}