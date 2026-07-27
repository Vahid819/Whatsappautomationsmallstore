interface OrderHeaderProps {
  totalOrders: number;
}

export function OrderHeader({
  totalOrders,
}: OrderHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Orders
        </h1>

        <p className="text-muted-foreground">
          Manage customer orders
        </p>
      </div>

      <div className="rounded-lg border px-4 py-2">
        Total Orders: {totalOrders}
      </div>
    </div>
  );
}