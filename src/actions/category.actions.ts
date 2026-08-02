"use server";

import { revalidatePath } from "next/cache";

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category.service";

// ==============================
// Create Category
// ==============================

export async function createCategoryAction(
  name: string,
  icon: string
) {
  try {
    const category = await createCategory(name, icon);

    revalidatePath("/dashboard/categories");

    return {
  success: true,
  message: "Category created successfully.",
  category,
};
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to create category.",
    };
  }
}

// ==============================
// Update Category
// ==============================

export async function updateCategoryAction(
  id: string,
  data: {
    name?: string;
    icon?: string;
  }
) {
  try {
    await updateCategory(id, data);

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      message: "Category updated successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to update category.",
    };
  }
}

// ==============================
// Delete Category
// ==============================

export async function deleteCategoryAction(
  id: string
) {
  try {
    await deleteCategory(id);

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      message: "Category deleted successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to delete category.",
    };
  }
}