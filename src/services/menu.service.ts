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
   image?: string;

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

  const groupedProducts: Record<string, MenuItem[]> = {};

  for (const product of products) {
    if (!groupedProducts[product.category]) {
      groupedProducts[product.category] = [];
    }

    groupedProducts[product.category].push(product);
  }

  for (const category of Object.keys(groupedProducts)) {
    message += `📦 *${category}*\n`;

    for (const product of groupedProducts[category]) {
      message += `${product.productNumber}. ${product.name} ........ ₹${product.price}\n`;
    }

    message += "\n";
  }

  message += `━━━━━━━━━━━━━━

🛒 *Reply in this format*

1 x2
4 x1
8 x3

Example

1 x2
5 x1`;

  return message;
}