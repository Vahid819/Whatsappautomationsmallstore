import { Order } from "@/types/order";

import { OrderRow } from "./order-row";
import { MapButton } from "./map-button";
import { DoneOrderButton } from "./done-order-button";
import { StatusBadge } from "./status-badge";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({
  orders,
}: OrderTableProps) {
  return (
    <>
      {/* ========================================= */}
      {/* DESKTOP / LAPTOP */}
      {/* ========================================= */}

      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <td
                      colSpan={8}
                      className="h-40 text-center text-muted-foreground"
                    >
                      No orders found.
                    </td>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ========================================= */}
      {/* MOBILE */}
      {/* ========================================= */}

      <div className="grid gap-4 md:hidden">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No orders found.
              </p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <MobileOrderCard
              key={order.id}
              order={order}
            />
          ))
        )}
      </div>
    </>
  );
}

/* ============================================= */
/* MOBILE ORDER CARD */
/* ============================================= */

function MobileOrderCard({
  order,
}: {
  order: Order;
}) {
  const isDelivered =
    order.status === "DELIVERED";

  const isCancelled =
    order.status === "CANCELLED";

  const showDeliveryActions =
    !isDelivered && !isCancelled;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">

        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Order
            </p>

            <h2 className="text-lg font-bold">
              #{order.orderNumber}
            </h2>
          </div>

          <StatusBadge
            status={order.status}
          />
        </div>

        <div className="my-4 border-t" />

        {/* ===================================== */}
        {/* CUSTOMER */}
        {/* ===================================== */}

        <div>
          <p className="text-xs text-muted-foreground">
            Customer
          </p>

          <p className="mt-1 font-semibold">
            {order.customerName}
          </p>

          <p className="text-sm text-muted-foreground">
            {order.customerPhone}
          </p>
        </div>

        {/* ===================================== */}
        {/* ADDRESS */}
        {/* ===================================== */}

        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Delivery Address
          </p>

          <p className="mt-1 text-sm">
            {order.customerAddress}
          </p>

          {order.customerLandmark && (
            <p className="mt-1 text-xs text-muted-foreground">
              Landmark: {order.customerLandmark}
            </p>
          )}
        </div>

        {/* ===================================== */}
        {/* PRODUCTS */}
        {/* ===================================== */}

        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Products
          </p>

          <div className="mt-2 space-y-2">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.productNumber}`}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {item.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  ₹{item.total}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 border-t" />

        {/* ===================================== */}
        {/* TOTAL + PAYMENT */}
        {/* ===================================== */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Total
            </p>

            <p className="text-xl font-bold">
              ₹{order.totalAmount}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Payment
            </p>

            <p className="text-sm font-semibold">
              {order.paymentMethod}
            </p>
          </div>
        </div>

        {/* ===================================== */}
        {/* DATE */}
        {/* ===================================== */}

        <p className="mt-3 text-xs text-muted-foreground">
          {order.createdAt
            ? new Date(
                order.createdAt
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </p>

        {/* ===================================== */}
        {/* DELIVERY ACTIONS */}
        {/* ===================================== */}

        {showDeliveryActions && (
          <div className="mt-5 grid grid-cols-2 gap-3">

            <MapButton
              address={order.customerAddress}
            />

            <DoneOrderButton
              orderId={order.id}
            />

          </div>
        )}

        {/* ===================================== */}
        {/* DELIVERED */}
        {/* ===================================== */}

        {isDelivered && (
          <div className="mt-5 flex w-full items-center justify-center rounded-md border px-4 py-3 text-sm font-semibold">
            ✓ Order Delivered
          </div>
        )}

        {/* ===================================== */}
        {/* CANCELLED */}
        {/* ===================================== */}

        {isCancelled && (
          <div className="mt-5 flex w-full items-center justify-center rounded-md border px-4 py-3 text-sm font-semibold text-muted-foreground">
            Order Cancelled
          </div>
        )}

      </CardContent>
    </Card>
  );
}