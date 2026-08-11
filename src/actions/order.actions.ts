"use server";

import { revalidatePath } from "next/cache";

import { updateOrderStatus } from "@/services/order.service";

import { OrderStatus } from "@/types/order";

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
) {
  try {
    await updateOrderStatus(
      orderId,
      status
    );

    revalidatePath("/dashboard/orders");

    return {
      success: true,
      message: "Order status updated successfully.",
    };
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return {
      success: false,
      message: "Failed to update order status.",
    };
  }
}