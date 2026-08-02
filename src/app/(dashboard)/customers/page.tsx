import { getCustomers } from "@/services/customer.service";

import { CustomerHeader } from "@/components/customers/customer-header";
import { CustomerTable } from "@/components/customers/customer-table";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <CustomerHeader
        totalCustomers={customers.length}
      />

      <CustomerTable
        customers={customers}
      />
    </div>
  );
}