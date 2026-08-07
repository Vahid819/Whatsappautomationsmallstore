export const dynamic = "force-dynamic";

import { getOrders } from "@/services/order.service";
import { OrderHeader } from "@/components/orders/order-header";
import { OrderTable } from "@/components/orders/order-table";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <OrderHeader totalOrders={orders.length} />

      <OrderTable orders={orders} />
    </div>
  );
}
