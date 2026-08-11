"use server";

import { revalidatePath } from "next/cache";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/dashboard/product.service";

import { ProductFormValues } from "@/schemas/productSchema";

// ==========================================
// Create Product
// ==========================================

export async function createProductAction(
  values: ProductFormValues
) {
  try {
    const result = await createProduct(values);

    if (!result.success) {
      return result;
    }

    revalidatePath("/dashboard/products");

    return result;
  } catch (error) {
    console.error("Create product error:", error);

    return {
      success: false,
      message: "Failed to create product.",
    };
  }
}

// ==========================================
// Update Product
// ==========================================

export async function updateProductAction(
  productId: string,
  values: ProductFormValues
) {
  try {
    const result = await updateProduct(
      productId,
      values
    );

    if (!result.success) {
      return result;
    }

    revalidatePath("/dashboard/products");

    return result;
  } catch (error) {
    console.error("Update product error:", error);

    return {
      success: false,
      message: "Failed to update product.",
    };
  }
}

// ==========================================
// Delete Product
// ==========================================

export async function deleteProductAction(
  productId: string
) {
  try {
    await deleteProduct(productId);

    revalidatePath("/dashboard/products");

    return {
      success: true,
      message: "Product deleted successfully.",
    };
  } catch (error) {
    console.error("Delete product error:", error);

    return {
      success: false,
      message: "Failed to delete product.",
    };
  }
}