"use client";

import { useState } from "react";
import { Loader2, MapPin, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { placeCustomerOrder } from "@/actions/customer-order.actions";
import { MenuItem } from "@/services/menu.service";

interface CartItem extends MenuItem {
  quantity: number;
}

interface Customer {
  phone: string;
  name: string;
  address: string;
  mobile: string;
  landmark?: string;
  instructions?: string;
}

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  customer: Customer;
  cart: CartItem[];

  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;

  token: string;

  onOrderPlaced?: () => void;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  customer,
  cart,
  subtotal,
  deliveryCharge,
  totalAmount,
  token,
  onOrderPlaced,
}: CheckoutDialogProps) {
  const [isPending, setIsPending] = useState(false);

  const [address, setAddress] = useState(
    customer.address ?? ""
  );

  const [landmark, setLandmark] = useState(
    customer.landmark ?? ""
  );

  const [instructions, setInstructions] =
    useState(customer.instructions ?? "");

  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "UPI">("COD");

  if (!open) {
    return null;
  }

  async function handlePlaceOrder() {
    if (!address.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setIsPending(true);

      const result = await placeCustomerOrder({
        token,

        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),

        paymentMethod,

        customerAddress: address.trim(),

        customerLandmark:
          landmark.trim(),

        customerInstructions:
          instructions.trim(),
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Order placed successfully!");

      onOpenChange(false);

      onOrderPlaced?.();

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      toast.error(
        "Unable to place your order. Please try again."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg overflow-hidden rounded-2xl border bg-background shadow-xl">

        {/* Header */}
        <div className="border-b p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Checkout
              </h2>

              <p className="text-sm text-muted-foreground">
                Review your order before placing it.
              </p>
            </div>

          </div>

        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-5">

          {/* Customer */}
          <div className="mb-6 rounded-xl border bg-muted/30 p-4">

            <h3 className="mb-3 font-semibold">
              Customer
            </h3>

            <div className="space-y-1 text-sm">

              <p>
                <span className="text-muted-foreground">
                  Name:
                </span>{" "}
                {customer.name}
              </p>

              <p>
                <span className="text-muted-foreground">
                  Phone:
                </span>{" "}
                {customer.mobile ||
                  customer.phone}
              </p>

            </div>

          </div>

          {/* Address */}
          <div className="space-y-4">

            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium"
              >
                Delivery Address *
              </label>

              <div className="relative">

                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <textarea
                  id="address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  rows={3}
                  disabled={isPending}
                  placeholder="Enter your delivery address"
                  className="w-full resize-none rounded-lg border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />

              </div>
            </div>

            {/* Landmark */}
            <div>

              <label
                htmlFor="landmark"
                className="mb-2 block text-sm font-medium"
              >
                Landmark
              </label>

              <input
                id="landmark"
                value={landmark}
                onChange={(event) =>
                  setLandmark(event.target.value)
                }
                disabled={isPending}
                placeholder="Near school, temple, etc."
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />

            </div>

            {/* Instructions */}
            <div>

              <label
                htmlFor="instructions"
                className="mb-2 block text-sm font-medium"
              >
                Delivery Instructions
              </label>

              <textarea
                id="instructions"
                value={instructions}
                onChange={(event) =>
                  setInstructions(event.target.value)
                }
                rows={2}
                disabled={isPending}
                placeholder="Any special instructions?"
                className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />

            </div>

          </div>

          {/* Payment */}
          <div className="mt-6">

            <h3 className="mb-3 font-semibold">
              Payment Method
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">

              {/* COD */}
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  setPaymentMethod("COD")
                }
                className={`rounded-xl border p-4 text-left transition ${
                  paymentMethod === "COD"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:bg-accent"
                }`}
              >
                <p className="font-semibold">
                  Cash on Delivery
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Pay when your order arrives.
                </p>
              </button>

              {/* UPI */}
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  setPaymentMethod("UPI")
                }
                className={`rounded-xl border p-4 text-left transition ${
                  paymentMethod === "UPI"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:bg-accent"
                }`}
              >
                <p className="font-semibold">
                  UPI
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Pay using UPI.
                </p>
              </button>

            </div>

          </div>

          {/* Order Summary */}
          <div className="mt-6 rounded-xl border p-4">

            <h3 className="mb-4 font-semibold">
              Order Summary
            </h3>

            <div className="space-y-3">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >

                  <div className="min-w-0">

                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      ₹{item.price} ×{" "}
                      {item.quantity}
                    </p>

                  </div>

                  <p className="font-medium">
                    ₹
                    {item.price *
                      item.quantity}
                  </p>

                </div>
              ))}

            </div>

            <div className="my-4 border-t" />

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span>
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Delivery
                </span>

                <span>
                  ₹{deliveryCharge}
                </span>
              </div>

            </div>

            <div className="my-4 border-t" />

            <div className="flex items-center justify-between">

              <span className="font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-primary">
                ₹{totalAmount}
              </span>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t p-5">

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              onOpenChange(false)
            }
            className="flex-1 rounded-lg border px-4 py-3 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={handlePlaceOrder}
            className="flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing...
              </>
            ) : (
              `Place Order • ₹${totalAmount}`
            )}
          </button>

        </div>

      </div>

    </div>
  );
}