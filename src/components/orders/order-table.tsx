import { Order } from "@/types/order";

import { OrderRow } from "./order-row";

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
  );
}