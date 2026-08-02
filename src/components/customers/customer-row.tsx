import Link from "next/link";
import { Eye } from "lucide-react";

import { Customer } from "@/services/customer.service";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface CustomerRowProps {
  customer: Customer;
}

export function CustomerRow({
  customer,
}: CustomerRowProps) {
  return (
    <TableRow className="hover:bg-muted transition-colors duration-200">
      {/* Customer Name */}
      <TableCell>
        <div className="font-medium">
          {customer.name}
        </div>
      </TableCell>

      {/* Phone */}
      <TableCell>
        {customer.phone}
      </TableCell>

      {/* Address */}
      <TableCell className="max-w-xs truncate">
        {customer.address}
      </TableCell>

      {/* State */}
      <TableCell>
        {customer.state}
      </TableCell>

      {/* Cart */}
      <TableCell>
        {customer.cart.length} item(s)
      </TableCell>

      {/* Action */}
      <TableCell>
        <Link
          href={`/dashboard/customers/${customer.phone}`}
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <Eye className="h-4 w-4" />
          View
        </Link>
      </TableCell>
    </TableRow>
  );
}