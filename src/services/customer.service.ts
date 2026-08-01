import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { ConversationState } from "@/types/conversation";
import { OrderItem } from "@/types/order";

export interface Customer {
  phone: string;

  name: string;

  address: string;

  mobile: string;

  landmark?: string;

  instructions?: string;

  lastMessage: string;

  state: ConversationState;

  cart: OrderItem[];
}

export interface CreateCustomerInput {
  phone: string;
  name: string;
  address: string;
  mobile: string;

  landmark?: string;
  instructions?: string;
}

const customerCollection = adminDb.collection("customers");

// Get customer
export async function getCustomer(phone: string): Promise<Customer | null> {
  const doc = await customerCollection.doc(phone).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data() as Customer;
}

// Check if customer exists
export async function customerExists(phone: string): Promise<boolean> {
  const doc = await customerCollection.doc(phone).get();

  return doc.exists;
}

// Create customer
export async function createCustomer(data: CreateCustomerInput) {
  await customerCollection.doc(data.phone).set({
    phone: data.phone,
    name: data.name,
    address: data.address,
    mobile: data.mobile,

    landmark: data.landmark ?? "",
    instructions: data.instructions ?? "",

    lastMessage: "",

    state: ConversationState.REGISTERED,

    cart: [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

// Update customer
export async function updateCustomer(
  phone: string,
  data: Partial<Customer>
): Promise<void> {
  await customerCollection.doc(phone).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

// Delete customer
export async function deleteCustomer(phone: string): Promise<void> {
  await customerCollection.doc(phone).delete();
}