import { getOrders } from "@/services/order.service";
import { OrderHeader } from "@/components/orders/order-header";
// import { OrderStats } from "@/components/orders/order-stats";
// import { OrderToolbar } from "@/components/orders/order-toolbar";
// import { OrderTable } from "@/components/orders/order-table";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <OrderHeader totalOrders={orders.length} />

      {/* <OrderStats orders={orders} />

      <OrderToolbar />

      <OrderTable orders={orders} /> */}
    </div>
  );
}