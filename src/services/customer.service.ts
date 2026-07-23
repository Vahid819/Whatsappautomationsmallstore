// src/services/customer.service.ts

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export interface CustomerData {
  phone: string;
  name?: string;
  lastMessage: string;
}

export async function saveCustomer(data: CustomerData) {
  try {
    console.log("🚀 Saving customer:", data);

    const customerRef = adminDb.collection("customers").doc(data.phone);

    const customerSnap = await customerRef.get();

    console.log("Document exists:", customerSnap.exists);

    if (!customerSnap.exists) {
      await customerRef.set({
        phone: data.phone,
        name: data.name || "",
        lastMessage: data.lastMessage,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log("✅ New customer created");
    } else {
      await customerRef.update({
        lastMessage: data.lastMessage,
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log("✅ Customer updated");
    }
  } catch (error) {
    console.error("❌ Error saving customer:", error);
    throw error;
  }
}