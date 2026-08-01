import { adminDb } from "@/lib/firebase/admin";
import { Order } from "@/types/order";
import { OrderStatus } from "@/types/order";
import {
  Timestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";;

const orderCollection = adminDb.collection("orders");

function mapOrder(
  doc: DocumentSnapshot | QueryDocumentSnapshot
): Order {
  const data = doc.data();

  if (!data) {
    throw new Error("Order data not found");
  }

  return {
    id: doc.id,

    orderNumber: data.orderNumber,

    customerId: data.customerId,

    customerPhone: data.customerPhone,
    customerName: data.customerName,

    customerAddress: data.customerAddress,
    customerLandmark: data.customerLandmark ?? "",
    customerInstructions: data.customerInstructions ?? "",

    items: data.items ?? [],

    subtotal: data.subtotal ?? 0,
    deliveryCharge: data.deliveryCharge ?? 0,
    discount: data.discount ?? 0,
    totalAmount: data.totalAmount ?? 0,

    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,

    status: data.status,

    createdAt:
      data.createdAt?.toDate().toISOString() ?? null,

    updatedAt:
      data.updatedAt?.toDate().toISOString() ?? null,
  };
}

export async function getOrders(): Promise<Order[]> {
  try {
    const snapshot = await orderCollection
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(mapOrder);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  const doc = await orderCollection.doc(id).get();

  if (!doc.exists) return null;

  return mapOrder(doc);
}

async function getNextOrderNumber(): Promise<number> {
  const snapshot = await orderCollection
    .orderBy("orderNumber", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) {
    return 1001;
  }

  const lastOrder = snapshot.docs[0].data();

  return (lastOrder.orderNumber ?? 1000) + 1;
}

export async function createOrder(
  data: Omit<Order, "id" | "orderNumber">
): Promise<string> {
  try {
    const orderNumber = await getNextOrderNumber();

    const docRef = await orderCollection.add({
      ...data,
      orderNumber,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  const doc = await orderCollection.doc(id).get();

if (!doc.exists) {
  throw new Error("Order not found");
}

await doc.ref.update({
  status,
  updatedAt: Timestamp.now(),
});
}

export async function deleteOrder(id: string): Promise<void> {
  const doc = await orderCollection.doc(id).get();

  if (!doc.exists) {
    throw new Error("Order not found");
  }

  await doc.ref.delete();
}