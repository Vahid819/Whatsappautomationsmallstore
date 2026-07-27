export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

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

  customerPhone: string;
  customerName: string;
  customerAddress: string;

  items: OrderItem[];

  subtotal: number;

  status: OrderStatus;

  createdAt?: string | null;
  updatedAt?: string | null;
}