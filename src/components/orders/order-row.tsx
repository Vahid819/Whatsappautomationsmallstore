import Link from "next/link";

import { Eye } from "lucide-react";

import { Order } from "@/types/order";

import { StatusBadge } from "./status-badge";

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
  return (
    <TableRow>
      {/* Order Number */}
      <TableCell className="font-semibold">
        #{order.orderNumber}
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
        <div className="space-y-1">
          {order.items.slice(0, 2).map((item) => (
            <div
              key={item.productId}
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
      <TableCell className="font-medium">
        ₹{order.totalAmount}
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

      {/* Action */}
      <TableCell>
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <Eye className="h-4 w-4" />
          View
        </Link>
      </TableCell>
    </TableRow>
  );
}