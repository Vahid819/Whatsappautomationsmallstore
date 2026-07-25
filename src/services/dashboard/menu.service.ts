import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { Menu } from "@/types/menu";

const menuCollection = adminDb.collection("menus");

export async function getMenus(): Promise<Menu[]> {
  const snapshot = await menuCollection.orderBy("createdAt", "desc").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Menu, "id">),
  }));
}

export async function getMenu(id: string): Promise<Menu | null> {
  const doc = await menuCollection.doc(id).get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...(doc.data() as Omit<Menu, "id">),
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