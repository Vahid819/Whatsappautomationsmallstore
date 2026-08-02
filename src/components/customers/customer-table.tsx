import { Customer } from "@/services/customer.service";
import { CustomerRow } from "./customer-row";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CustomerTableProps {
  customers: Customer[];
}

export function CustomerTable({
  customers,
}: CustomerTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>

              <TableHead>Phone</TableHead>

              <TableHead>Address</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Cart</TableHead>

              <TableHead>
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-40"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <CustomerRow
                  key={customer.phone}
                  customer={customer}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}