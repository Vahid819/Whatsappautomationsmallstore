import { Order } from "@/types/order";
import { OrderRow } from "./order-row";
import { MapButton } from "./map-button";
import { StatusBadge } from "./status-badge";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({
  orders,
}: OrderTableProps) {
  return (
    <>
      {/* ================================================= */}
      {/* DESKTOP / LAPTOP */}
      {/* ================================================= */}

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

      {/* ================================================= */}
      {/* MOBILE */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-40 items-center justify-center text-center">
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

/* ================================================= */
/* MOBILE ORDER CARD */
/* ================================================= */

function MobileOrderCard({
  order,
}: {
  order: Order;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Order
            </p>

            <h2 className="text-lg font-semibold">
              #{order.orderNumber}
            </h2>
          </div>

          <StatusBadge status={order.status} />
        </div>

        <div className="my-4 border-t" />

        {/* Customer */}
        <div>
          <p className="text-xs text-muted-foreground">
            Customer
          </p>

          <p className="mt-1 font-medium">
            {order.customerName}
          </p>

          <p className="text-sm text-muted-foreground">
            {order.customerPhone}
          </p>
        </div>

        {/* Address */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Delivery Address
          </p>

          <p className="mt-1 line-clamp-2 text-sm">
            {order.customerAddress}
          </p>

          {order.customerLandmark && (
            <p className="mt-1 text-xs text-muted-foreground">
              Landmark: {order.customerLandmark}
            </p>
          )}
        </div>

        {/* Products */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Products
          </p>

          <div className="mt-2 space-y-2">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.productNumber}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {item.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 font-medium">
                  ₹{item.total}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 border-t" />

        {/* Bottom information */}
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

            <p className="text-sm font-medium">
              {order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="mt-3">
          <p className="text-xs text-muted-foreground">
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
        </div>

        {/* Map */}
        <div className="mt-4">
          <MapButton
            address={order.customerAddress}
          />
        </div>
      </CardContent>
    </Card>
  );
}