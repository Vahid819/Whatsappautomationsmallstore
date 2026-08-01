// src/services/menu.service.ts

import { adminDb } from "@/lib/firebase/admin";

export interface MenuItem {
  id: string;

  productNumber: number;

  name: string;

  variant: string;

  description: string;

  category: string;

  price: number;

  available: boolean;
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
  const products = await getAvailableMenus();

  if (products.length === 0) {
    return "❌ No products available.";
  }

  let message = "🥚 *PRIME PROTEINS MENU*\n\n";

  let currentCategory = "";

  const emojiMap: Record<string, string> = {
    Eggs: "🥚",
    Paneer: "🧀",
    "Green Peas": "🫛",
    "Sweet Corn": "🌽",
  };

  for (const product of products) {
    if (currentCategory !== product.category) {
      currentCategory = product.category;

      message += `${
        emojiMap[currentCategory] ?? "📦"
      } *${currentCategory}*\n`;
    }

    message += `${product.productNumber}. ${product.description} ........ ₹${product.price}\n`;
  }

  message += `

━━━━━━━━━━━━━━

🛒 *Reply in this format*

1 x2
4 x1
8 x3

Example

1 x2
5 x1`;

  return message;
}