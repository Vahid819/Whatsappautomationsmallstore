// src/services/customer.service.ts

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { ConversationState } from "@/types/conversation";

export interface Customer {
  phone: string;
  name?: string;
  address?: string;
  mobile?: string;
  lastMessage?: string;
  state: ConversationState;
}

const customerCollection = adminDb.collection("customers");

// Get customer
export async function getCustomer(phone: string) {
  const doc = await customerCollection.doc(phone).get();

  if (!doc.exists) return null;

  return doc.data() as Customer;
}

// Create customer
export async function createCustomer(phone: string, name:string, lastMessage:string) {
  await customerCollection.doc(phone).set({
    phone,
    name: "",
    address: "",
    mobile: "",
    lastMessage: "",
    state: ConversationState.WAITING_NAME,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

// Update customer
export async function updateCustomer(
  phone: string,
  data: Partial<Customer>
) {
  await customerCollection.doc(phone).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}