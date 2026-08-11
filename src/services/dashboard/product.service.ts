import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { ProductFormValues } from "@/schemas/productSchema";

const COLLECTION = "products";

// ==========================================
// Create Product
// ==========================================

export async function createProduct(
  data: ProductFormValues
) {
  try {
    const lastProductSnapshot = await adminDb
      .collection(COLLECTION)
      .orderBy("productNumber", "desc")
      .limit(1)
      .get();

    const nextProductNumber =
      lastProductSnapshot.empty
        ? 1
        : (lastProductSnapshot.docs[0].data()
            .productNumber ?? 0) + 1;

    const docRef = adminDb
      .collection(COLLECTION)
      .doc();

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

// ==========================================
// Get Product
// ==========================================

export async function getProduct(
  productId: string
) {
  try {
    const doc = await adminDb
      .collection(COLLECTION)
      .doc(productId)
      .get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();

    if (!data) {
      return null;
    }

    return {
      id: doc.id,
      ...data,
    };
  } catch (error) {
    console.error("Get Product:", error);

    throw error;
  }
}

// ==========================================
// Update Product
// ==========================================

export async function updateProduct(
  productId: string,
  data: ProductFormValues
) {
  try {
    const productRef = adminDb
      .collection(COLLECTION)
      .doc(productId);

    const product = await productRef.get();

    if (!product.exists) {
      throw new Error("Product not found");
    }

    await productRef.update({
      name: data.name,

      description: data.description,

      category: data.category,

      price: data.price,

      available: data.available,

      image: data.image ?? "",

      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: "Product updated successfully.",
    };
  } catch (error) {
    console.error("Update Product:", error);

    return {
      success: false,
      message: "Failed to update product.",
    };
  }
}

// ==========================================
// Delete Product
// ==========================================

export async function deleteProduct(
  productId: string
): Promise<void> {
  const productRef = adminDb
    .collection(COLLECTION)
    .doc(productId);

  const product = await productRef.get();

  if (!product.exists) {
    throw new Error("Product not found");
  }

  await productRef.delete();
}