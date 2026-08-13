import { getAvailableMenus } from "@/services/menu.service";
import {
  getCustomerByOrderToken,
} from "@/services/order-link.service";

import { CustomerOrderPage } from "@/components/customer-order/customer-order-page";

interface OrderPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function OrderPage({
  searchParams,
}: OrderPageProps) {
  const params = await searchParams;

  const token = params.token;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Invalid Order Link
          </h1>

          <p className="mt-2 text-muted-foreground">
            Please request a new order link on WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  const customer =
    await getCustomerByOrderToken(token);

  if (!customer) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Order Link Expired
          </h1>

          <p className="mt-2 text-muted-foreground">
            Please send MENU on WhatsApp to get a
            new ordering link.
          </p>
        </div>
      </div>
    );
  }

  const products =
    await getAvailableMenus();

  return (
    <CustomerOrderPage
      customer={customer}
      products={products}
      token={token}
    />
  );
}