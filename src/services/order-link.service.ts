import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";

const customerCollection =
  adminDb.collection("customers");

// ==========================================
// Create Customer Order Token
// ==========================================

export async function createCustomerOrderToken(
  phone: string
): Promise<string> {
  const customerRef =
    customerCollection.doc(phone);

  const customer = await customerRef.get();

  if (!customer.exists) {
    throw new Error(
      "Customer is not registered."
    );
  }

  const token = crypto
    .randomBytes(32)
    .toString("hex");

  const expiresAt = new Date(
    Date.now() +
      24 * 60 * 60 * 1000
  );

  await customerRef.update({
    orderToken: token,

    orderTokenExpiresAt:
      Timestamp.fromDate(expiresAt),

    updatedAt: Timestamp.now(),
  });

  return token;
}

// ==========================================
// Get Customer By Order Token
// ==========================================

export async function getCustomerByOrderToken(
  token: string
) {
  if (!token) {
    return null;
  }

  const snapshot = await customerCollection
    .where("orderToken", "==", token)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];

  const data = doc.data();

  const expiresAt =
    data.orderTokenExpiresAt?.toDate();

  if (
    !expiresAt ||
    expiresAt.getTime() < Date.now()
  ) {
    return null;
  }

  return {
    phone: data.phone,
    name: data.name,
    address: data.address ?? "",
    mobile: data.mobile ?? data.phone,
    landmark: data.landmark ?? "",
    instructions:
      data.instructions ?? "",
  };
}

// ==========================================
// Build Customer Order URL
// ==========================================

export function buildCustomerOrderUrl(
  token: string
): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is not configured"
    );
  }

  return `${baseUrl}/order?token=${encodeURIComponent(
    token
  )}`;
}