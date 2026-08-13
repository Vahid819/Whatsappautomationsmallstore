"use server";

import { createOrder } from "@/services/order.service";
import { getCustomerByOrderToken } from "@/services/order-link.service";
import { adminDb } from "@/lib/firebase/admin";

interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface CheckoutData {
  token: string;
  items: CheckoutItem[];
  paymentMethod: "COD" | "UPI";
  customerAddress: string;
  customerLandmark?: string;
  customerInstructions?: string;
}

export async function placeCustomerOrder(
  data: CheckoutData
) {
  try {
    if (!data.items.length) {
      return {
        success: false,
        message: "Your cart is empty.",
      };
    }

    // 1. Find customer using secure token
    const customer =
      await getCustomerByOrderToken(data.token);

    if (!customer) {
      return {
        success: false,
        message: "Order link is invalid or expired.",
      };
    }

    // 2. Get actual products from Firestore
    const productRefs = data.items.map((item) =>
      adminDb.collection("products").doc(item.productId)
    );

    const productDocs =
      await adminDb.getAll(...productRefs);

    const orderItems = [];

    for (const cartItem of data.items) {
      if (cartItem.quantity <= 0) {
        return {
          success: false,
          message: "Invalid product quantity.",
        };
      }

      const productDoc = productDocs.find(
        (doc) => doc.id === cartItem.productId
      );

      if (!productDoc || !productDoc.exists) {
        return {
          success: false,
          message: "One of the products no longer exists.",
        };
      }

      const product = productDoc.data();

      if (!product?.available) {
        return {
          success: false,
          message: `${product?.name ?? "A product"} is no longer available.`,
        };
      }

      const price = Number(product.price);

      orderItems.push({
        productId: productDoc.id,
        productNumber: product.productNumber,
        name: product.name,
        price,
        quantity: cartItem.quantity,
        total: price * cartItem.quantity,
      });
    }

    // 3. Calculate total on SERVER
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const deliveryCharge = 20;
    const discount = 0;

    const totalAmount =
      subtotal +
      deliveryCharge -
      discount;

    // 4. Create order using your existing service
    const orderId = await createOrder({
      customerId: customer.phone,

      customerPhone: customer.phone,
      customerName: customer.name,

      customerAddress:
        data.customerAddress,

      customerLandmark:
        data.customerLandmark ?? "",

      customerInstructions:
        data.customerInstructions ?? "",

      items: orderItems,

      subtotal,
      deliveryCharge,
      discount,
      totalAmount,

      paymentMethod:
        data.paymentMethod,

      paymentStatus: "PENDING",

      status: "PENDING",
    });

    return {
      success: true,
      orderId,
      message: "Order placed successfully.",
    };

  } catch (error) {
    console.error(
      "Place customer order error:",
      error
    );

    return {
      success: false,
      message:
        "Something went wrong while placing your order.",
    };
  }
}