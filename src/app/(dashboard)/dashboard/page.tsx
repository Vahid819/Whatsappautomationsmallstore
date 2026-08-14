import {
  ShoppingBag,
  Users,
  Package,
  IndianRupee,
  ArrowRight,
  Clock3,
  CheckCircle2,
  Truck,
} from "lucide-react";

import Link from "next/link";

import { getOrders } from "@/services/order.service";
import { getCustomers } from "@/services/customer.service";
import { getMenuItems } from "@/services/menu.service";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page() {
  const [orders, customers, products] =
    await Promise.all([
      getOrders(),
      getCustomers(),
      getMenuItems(),
    ]);

  // ==========================================
  // Order Stats
  // ==========================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "PREPARING"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  // ==========================================
  // Revenue
  // ==========================================

  const totalRevenue = orders
    .filter(
      (order) => order.status !== "CANCELLED"
    )
    .reduce(
      (total, order) =>
        total + order.totalAmount,
      0
    );

  // ==========================================
  // Recent Orders
  // ==========================================

  const recentOrders = orders.slice(0, 5);

  // ==========================================
  // Products
  // ==========================================

  const availableProducts =
    products.filter(
      (product) => product.available
    ).length;

  return (
    <div className="space-y-8">

      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-muted-foreground">
            Welcome to MominEgg Admin.
          </p>
        </div>

        <div className="flex gap-2">

          <Link
            href="/orders"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-accent"
          >
            View Orders
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>

        </div>

      </div>

      {/* ====================================== */}
      {/* Stats */}
      {/* ====================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Orders */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalOrders}
                </p>
              </div>

              <div className="rounded-xl bg-primary/10 p-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>

            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              All orders received
            </p>

          </CardContent>
        </Card>

        {/* Revenue */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  Total Revenue
                </p>

                <p className="mt-2 text-3xl font-bold">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-primary/10 p-3">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>

            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Excluding cancelled orders
            </p>

          </CardContent>
        </Card>

        {/* Customers */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  Customers
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {customers.length}
                </p>
              </div>

              <div className="rounded-xl bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>

            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Registered customers
            </p>

          </CardContent>
        </Card>

        {/* Products */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  Available Products
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {availableProducts}
                </p>
              </div>

              <div className="rounded-xl bg-primary/10 p-3">
                <Package className="h-5 w-5 text-primary" />
              </div>

            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Products available for ordering
            </p>

          </CardContent>
        </Card>

      </div>

      {/* ====================================== */}
      {/* Order Status */}
      {/* ====================================== */}

      <div className="grid gap-6 lg:grid-cols-4">

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-yellow-500/10 p-2">
                <Clock3 className="h-5 w-5 text-yellow-600" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Pending
                </p>

                <p className="text-2xl font-bold">
                  {pendingOrders}
                </p>
              </div>

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-blue-500/10 p-2">
                <Package className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Preparing
                </p>

                <p className="text-2xl font-bold">
                  {preparingOrders}
                </p>
              </div>

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-green-500/10 p-2">
                <Truck className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Delivered
                </p>

                <p className="text-2xl font-bold">
                  {deliveredOrders}
                </p>
              </div>

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex h-full items-center justify-between p-5">

            <div>
              <p className="text-sm text-muted-foreground">
                Need Attention
              </p>

              <p className="mt-1 text-2xl font-bold">
                {pendingOrders + preparingOrders}
              </p>
            </div>

            <Link
              href="/orders"
              className="rounded-lg border p-2 transition hover:bg-accent"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>

          </CardContent>
        </Card>

      </div>

      {/* ====================================== */}
      {/* Recent Orders */}
      {/* ====================================== */}

      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <div>
            <CardTitle>
              Recent Orders
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Latest customer orders
            </p>
          </div>

          <Link
            href="/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>

        </CardHeader>

        <CardContent>

          {recentOrders.length === 0 ? (
            <div className="py-10 text-center">

              <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No orders yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Customer orders will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {recentOrders.map((order) => (

                <div
                  key={order.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-semibold">
                      #{order.orderNumber}
                    </div>

                    <div>

                      <p className="font-medium">
                        {order.customerName}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {order.items.length}{" "}
                        {order.items.length === 1
                          ? "item"
                          : "items"}{" "}
                        • {order.customerPhone}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">

                    <span className="font-semibold">
                      ₹
                      {order.totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <Badge
                      variant={
                        order.status ===
                        "DELIVERED"
                          ? "default"
                          : order.status ===
                            "CANCELLED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {order.status.replace(
                        /_/g,
                        " "
                      )}
                    </Badge>

                  </div>

                </div>

              ))}

            </div>
          )}

        </CardContent>

      </Card>

      {/* ====================================== */}
      {/* Quick Actions */}
      {/* ====================================== */}

      <div className="grid gap-4 md:grid-cols-3">

        <Link
          href="/orders"
          className="group"
        >
          <Card className="transition hover:border-primary">

            <CardContent className="flex items-center justify-between p-5">

              <div>

                <p className="font-semibold">
                  Manage Orders
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  View and process customer orders
                </p>

              </div>

              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />

            </CardContent>

          </Card>
        </Link>

        <Link
          href="/customers"
          className="group"
        >
          <Card className="transition hover:border-primary">

            <CardContent className="flex items-center justify-between p-5">

              <div>

                <p className="font-semibold">
                  Customers
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  View registered customers
                </p>

              </div>

              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />

            </CardContent>

          </Card>
        </Link>

        <Link
          href="/menu"
          className="group"
        >
          <Card className="transition hover:border-primary">

            <CardContent className="flex items-center justify-between p-5">

              <div>

                <p className="font-semibold">
                  Manage Products
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add or update your products
                </p>

              </div>

              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />

            </CardContent>

          </Card>
        </Link>

      </div>

    </div>
  );
}