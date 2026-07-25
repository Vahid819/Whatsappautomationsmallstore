"use server";

import { revalidatePath } from "next/cache";

import { ProductFormValues } from "@/schemas/productSchema";
import { createProduct } from "@/services/dashboard/product.service";

export async function createProductAction(values: ProductFormValues) {
  const result = await createProduct(values);

  if (!result.success) {
    return result;
  }

  revalidatePath("/products");

  return result;
}