export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "PACKED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod =
  | "COD"
  | "UPI";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED";

export interface OrderItem {
  productId: string;
  productNumber: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;

  orderNumber: number;

  customerId: string;

  customerPhone: string;
  customerName: string;

  customerAddress: string;
  customerLandmark?: string;
  customerInstructions?: string;

  items: OrderItem[];

  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  status: OrderStatus;

  createdAt?: string | null;
  updatedAt?: string | null;
}