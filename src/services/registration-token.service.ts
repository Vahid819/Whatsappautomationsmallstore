import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const registrationTokenCollection =
  adminDb.collection("registrationTokens");

const TOKEN_EXPIRY_MINUTES = 15;

export interface RegistrationToken {
  token: string;
  phone: string;
  used: boolean;
  expiresAt: FirebaseFirestore.Timestamp;
  createdAt?: FirebaseFirestore.Timestamp;
}

/**
 * Generate a new registration token
 */
export async function generateRegistrationToken(
  phone: string
): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000)
  );

  await registrationTokenCollection.doc(token).set({
    token,
    phone,
    used: false,
    expiresAt,
    createdAt: FieldValue.serverTimestamp(),
  });

  return token;
}

/**
 * Verify registration token
 */
export async function verifyRegistrationToken(
  token: string
): Promise<RegistrationToken | null> {
  const doc = await registrationTokenCollection.doc(token).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data() as RegistrationToken;

  if (data.used) {
    return null;
  }

  if (data.expiresAt.toDate() < new Date()) {
    return null;
  }

  return data;
}

/**
 * Mark token as used
 */
export async function markRegistrationTokenUsed(
  token: string
): Promise<void> {
  await registrationTokenCollection.doc(token).update({
    used: true,
  });
}

/**
 * Delete token
 */
export async function deleteRegistrationToken(
  token: string
): Promise<void> {
  await registrationTokenCollection.doc(token).delete();
}