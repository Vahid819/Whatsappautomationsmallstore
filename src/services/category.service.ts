import { adminDb } from "@/lib/firebase/admin";
import {
  Timestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";

import { Category } from "@/types/category";

const categoryCollection = adminDb.collection("categories");

function mapCategory(
  doc: DocumentSnapshot | QueryDocumentSnapshot
): Category {
  const data = doc.data();

  if (!data) {
    throw new Error("Category not found");
  }

  return {
    id: doc.id,

    name: data.name,

    icon: data.icon ?? "📦",

    createdAt:
      data.createdAt?.toDate().toISOString() ?? null,

    updatedAt:
      data.updatedAt?.toDate().toISOString() ?? null,
  };
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const snapshot = await categoryCollection
    .orderBy("name")
    .get();

  return snapshot.docs.map(mapCategory);
}

// Get single category
export async function getCategory(
  id: string
): Promise<Category | null> {
  const doc = await categoryCollection.doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return mapCategory(doc);
}

// Create category
export async function createCategory(
  name: string,
  icon: string
): Promise<Category> {
  const docRef = await categoryCollection.add({
    name,
    icon,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return {
    id: docRef.id,
    name,
    icon,
    createdAt: null,
    updatedAt: null,
  };
}

// Update category
export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<void> {
  await categoryCollection.doc(id).update({
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Delete category
export async function deleteCategory(
  id: string
): Promise<void> {
  await categoryCollection.doc(id).delete();
}