import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { ProductFormValues } from "@/schemas/productSchema";

const COLLECTION = "products";

export async function createProduct(data: ProductFormValues) {
  try {
    // Get the highest existing product number
    const lastProductSnapshot = await adminDb
      .collection(COLLECTION)
      .orderBy("productNumber", "desc")
      .limit(1)
      .get();

    const nextProductNumber = lastProductSnapshot.empty
      ? 1
      : (lastProductSnapshot.docs[0].data().productNumber ?? 0) + 1;

    // Create a new document
    const docRef = adminDb.collection(COLLECTION).doc();

    await docRef.set({
      id: docRef.id,
      productNumber: nextProductNumber,

      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      available: data.available,
      image: data.image ?? "",

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      id: docRef.id,
      message: "Product created successfully.",
    };
  } catch (error) {
    console.error("Create Product:", error);

    return {
      success: false,
      message: "Failed to create product.",
    };
  }
}