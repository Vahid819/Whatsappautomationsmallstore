interface CustomerHeaderProps {
  totalCustomers: number;
}

export function CustomerHeader({
  totalCustomers,
}: CustomerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Customers
        </h1>

        <p className="text-muted-foreground">
          Manage your customers
        </p>
      </div>

      <div className="rounded-lg border px-4 py-2">
        Total Customers: {totalCustomers}
      </div>
    </div>
  );
}