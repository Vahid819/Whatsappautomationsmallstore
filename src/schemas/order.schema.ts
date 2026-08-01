import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  productNumber: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  total: z.number().positive(),
});

export const orderSchema = z.object({
  customerId: z.string().min(1),
  customerPhone: z.string().min(10),
  customerName: z.string().min(3),

  customerAddress: z.string().min(5),
  customerLandmark: z.string().optional(),
  customerInstructions: z.string().optional(),

  items: z.array(orderItemSchema).min(1),

  subtotal: z.number().nonnegative(),
  deliveryCharge: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),

  paymentMethod: z.enum(["COD", "UPI"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]),

  status: z.enum([
    "PENDING",
    "ACCEPTED",
    "PREPARING",
    "PACKED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export type OrderInput = z.infer<typeof orderSchema>;