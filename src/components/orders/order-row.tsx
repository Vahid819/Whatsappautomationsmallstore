import { Order } from "@/types/order";

import { StatusBadge } from "./status-badge";
import { MapButton } from "./map-button";
import { DoneOrderButton } from "./done-order-button";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface OrderRowProps {
  order: Order;
}

export function OrderRow({
  order,
}: OrderRowProps) {
  const canMarkDelivered =
    order.status !== "DELIVERED" &&
    order.status !== "CANCELLED";

  return (
    <TableRow>
      {/* Order Number */}
      <TableCell>
        <span className="font-medium">
          #{order.orderNumber}
        </span>
      </TableCell>

      {/* Customer */}
      <TableCell>
        <div className="font-medium">
          {order.customerName}
        </div>

        <div className="text-sm text-muted-foreground">
          {order.customerPhone}
        </div>
      </TableCell>

      {/* Products */}
      <TableCell>
        <div className="max-w-[240px] space-y-1">
          {order.items.slice(0, 2).map((item) => (
            <div
              key={`${item.productId}-${item.productNumber}`}
              className="text-sm"
            >
              {item.name} × {item.quantity}
            </div>
          ))}

          {order.items.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{order.items.length - 2} more item(s)
            </div>
          )}
        </div>
      </TableCell>

      {/* Total */}
      <TableCell>
        <span className="font-semibold">
          ₹{order.totalAmount}
        </span>
      </TableCell>

      {/* Payment */}
      <TableCell>
        {order.paymentMethod}
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadge status={order.status} />
      </TableCell>

      {/* Date */}
      <TableCell>
        {order.createdAt
          ? new Date(order.createdAt).toLocaleDateString(
              "en-IN"
            )
          : "-"}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <MapButton
            address={order.customerAddress}
          />

          {canMarkDelivered && (
            <DoneOrderButton
              orderId={order.id}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}