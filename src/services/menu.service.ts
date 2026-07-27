// src/services/menu.service.ts

import { adminDb } from "@/lib/firebase/admin";

export interface MenuItem {
  id: string;
  productNumber: number;
  name: string;
  price: number;
  available: boolean;
  category: string;
}

const menuCollection = adminDb.collection("products");

/**
 * Get all available menu items
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  const snapshot = await menuCollection
    .where("available", "==", true)
    .orderBy("productNumber", "asc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MenuItem, "id">),
  }));
}


/**
 * Get menu item by number (1,2,3...)
 */
export async function getMenuItemByNumber(
  number: number
): Promise<MenuItem | null> {
  const snapshot = await menuCollection
    .where("productNumber", "==", number)
    .where("available", "==", true)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...(snapshot.docs[0].data() as Omit<MenuItem, "id">),
  };
}

/**
 * Get available menu items (WhatsApp)
 */
export async function getAvailableMenus(): Promise<MenuItem[]> {
  const snapshot = await menuCollection
    .where("available", "==", true)
    .orderBy("productNumber", "asc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MenuItem, "id">),
  }));
}

/**
 * Generate WhatsApp menu message
 */
export async function getMenuMessage(): Promise<string> {
  const menuItems = await getAvailableMenus();

  if (menuItems.length === 0) {
    return "❌ Sorry, no products are available right now.";
  }

  let message = `🍳 *Welcome to MominEgg!*\n\n`;
  message += `📋 *Today's Menu*\n\n`;

  menuItems.forEach((item) => {
    message += `${item.productNumber}️⃣ *${item.name}* - ₹${item.price}\n`;
  });

  message += `\n💬 Reply with the *product number* to place your order.`;

  return message;
}