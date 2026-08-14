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

  createdAt?: string | null;

  updatedAt?: string | null;
}

const menuCollection =
  adminDb.collection("products");

// ==========================================
// Map Firestore Product → Plain MenuItem
// ==========================================

function mapMenuItem(
  doc: FirebaseFirestore.QueryDocumentSnapshot
): MenuItem {
  const data = doc.data();

  return {
    id: doc.id,

    productNumber:
      data.productNumber ?? 0,

    name:
      data.name ?? "",

    variant:
      data.variant ?? "",

    description:
      data.description ?? "",

    category:
      data.category ?? "",

    price:
      Number(data.price ?? 0),

    image:
      data.image ?? "",

    available:
      data.available ?? false,

    createdAt:
      data.createdAt?.toDate?.()?.toISOString() ??
      null,

    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() ??
      null,
  };
}

// ==========================================
// Get all available menu items
// ==========================================

export async function getMenuItems(): Promise<
  MenuItem[]
> {
  const snapshot = await menuCollection
    .where("available", "==", true)
    .orderBy("productNumber", "asc")
    .get();

  return snapshot.docs.map(mapMenuItem);
}

// ==========================================
// Get menu item by product number
// ==========================================

export async function getMenuItemByNumber(
  number: number
): Promise<MenuItem | null> {
  const snapshot = await menuCollection
    .where(
      "productNumber",
      "==",
      number
    )
    .where(
      "available",
      "==",
      true
    )
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return mapMenuItem(
    snapshot.docs[0]
  );
}

// ==========================================
// Get available menu items
// ==========================================

export async function getAvailableMenus(): Promise<
  MenuItem[]
> {
  const snapshot = await menuCollection
    .where("available", "==", true)
    .orderBy("productNumber", "asc")
    .get();

  return snapshot.docs.map(mapMenuItem);
}

// ==========================================
// Generate WhatsApp menu message
// ==========================================

export async function getMenuMessage(): Promise<string> {
  const products =
    await getAvailableMenus();

  if (products.length === 0) {
    return "❌ No products available.";
  }

  let message =
    "🥚 *PRIME PROTEINS MENU*\n\n";

  const groupedProducts: Record<
    string,
    MenuItem[]
  > = {};

  for (const product of products) {
    if (
      !groupedProducts[product.category]
    ) {
      groupedProducts[product.category] = [];
    }

    groupedProducts[
      product.category
    ].push(product);
  }

  for (const category of Object.keys(
    groupedProducts
  )) {
    message += `📦 *${category}*\n`;

    for (const product of
      groupedProducts[category]) {
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