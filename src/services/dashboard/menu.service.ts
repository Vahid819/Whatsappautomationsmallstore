import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { Menu } from "@/types/menu";

const menuCollection = adminDb.collection("products");

export async function getMenus(): Promise<Menu[]> {
  const snapshot = await menuCollection.get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      productNumber: data.productNumber,
      name: data.name,
       variant: data.variant ?? "",
      description: data.description,
      category: data.category,
      price: data.price,
      available: data.available,
      image: data.image ?? "",
      createdAt: data.createdAt?.toDate().toISOString() ?? null,
      updatedAt: data.updatedAt?.toDate().toISOString() ?? null,
    };
  });
}

export async function getMenu(id: string): Promise<Menu | null> {
  const doc = await menuCollection.doc(id).get();

  if (!doc.exists) return null;

  const data = doc.data()!;

  return {
    id: doc.id,
    productNumber: data.productNumber,
    name: data.name,
     variant: data.variant ?? "",
    description: data.description,
    category: data.category,
    price: data.price,
    available: data.available,
    image: data.image ?? "",
    createdAt: data.createdAt?.toDate().toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate().toISOString() ?? null,
  };
}

export async function createMenu(data: Omit<Menu, "id">) {
  await menuCollection.add({
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updateMenu(
  id: string,
  data: Partial<Omit<Menu, "id">>
) {
  await menuCollection.doc(id).update({
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteMenu(id: string) {
  await menuCollection.doc(id).delete();
}