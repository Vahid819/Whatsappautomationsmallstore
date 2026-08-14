"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

import { MenuItem } from "@/services/menu.service";
import { CheckoutDialog } from "./checkout-dialog";

interface Customer {
  phone: string;
  name: string;
  address: string;
  mobile: string;
  landmark?: string;
  instructions?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CustomerOrderPageProps {
  products: MenuItem[];
  customer: Customer;
  token: string;
}

const MINIMUM_ORDER_AMOUNT = 200;

const DELIVERY_CHARGE = 0;

export function CustomerOrderPage({
  products,
  customer,
  token,
}: CustomerOrderPageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [checkoutOpen, setCheckoutOpen] =
    useState(false);

  // ==========================================
  // Categories
  // ==========================================

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          products.map(
            (product) => product.category
          )
        )
      ),
    ];
  }, [products]);

  // ==========================================
  // Filter Products
  // ==========================================

  const filteredProducts = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.description
          .toLowerCase()
          .includes(searchText);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    products,
    selectedCategory,
    search,
  ]);

  // ==========================================
  // Add Product
  // ==========================================

  const addToCart = (product: MenuItem) => {
    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) => item.id === product.id
        );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // ==========================================
  // Increase Quantity
  // ==========================================

  const increaseQuantity = (
    productId: string
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // ==========================================
  // Decrease Quantity
  // ==========================================

  const decreaseQuantity = (
    productId: string
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ==========================================
  // Remove Product
  // ==========================================

  const removeFromCart = (
    productId: string
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  };

  // ==========================================
  // Calculations
  // ==========================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const minimumOrderReached =
    subtotal >= MINIMUM_ORDER_AMOUNT;

  const totalAmount = subtotal;

  // ==========================================
  // Open Checkout
  // ==========================================

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    if (!minimumOrderReached) {
      return;
    }

    setCheckoutOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">

          <div>
            <h1 className="text-xl font-bold">
              Prime Proteins
            </h1>

            <p className="text-xs text-muted-foreground">
              Fresh • Healthy • Protein Rich
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border px-4 py-2">

            <ShoppingCart className="h-4 w-4" />

            <span className="text-sm font-medium">
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}
            </span>

          </div>

        </div>

      </header>

      {/* ====================================== */}
      {/* MAIN */}
      {/* ====================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

          {/* ================================== */}
          {/* PRODUCTS */}
          {/* ================================== */}

          <section>

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Place Your Order
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Hi {customer.name}, select
                the products you want to
                order.
              </p>

            </div>

            {/* Search */}

            <div className="relative mb-4">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products..."
                className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

            </div>

            {/* Categories */}

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">

              {categories.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                      selectedCategory ===
                      category
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {category}
                  </button>
                )
              )}

            </div>

            {/* Product List */}

            <div className="space-y-3">

              {filteredProducts.length ===
              0 ? (
                <div className="rounded-xl border p-10 text-center">

                  <p className="font-medium">
                    No products found
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try another search or
                    category.
                  </p>

                </div>
              ) : (
                filteredProducts.map(
                  (product) => {
                    const cartItem =
                      cart.find(
                        (item) =>
                          item.id ===
                          product.id
                      );

                    return (
                      <div
                        key={product.id}
                        className="rounded-xl border p-4 transition hover:bg-accent/30"
                      >

                        <div className="flex items-center gap-4">

                          {/* Image */}

                          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">

                            {product.image ? (
                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl">
                                🥚
                              </span>
                            )}

                          </div>

                          {/* Product Info */}

                          <div className="min-w-0 flex-1">

                            <h3 className="font-semibold">
                              {product.name}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {
                                product.description
                              }
                            </p>

                            <p className="mt-2 font-semibold">
                              ₹{product.price}
                            </p>

                          </div>

                          {/* Product Action */}

                          <div className="shrink-0">

                            {cartItem ? (
                              <div className="flex items-center rounded-lg border">

                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(
                                      product.id
                                    )
                                  }
                                  className="p-2 hover:bg-accent"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>

                                <span className="min-w-8 text-center text-sm font-medium">
                                  {
                                    cartItem.quantity
                                  }
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    increaseQuantity(
                                      product.id
                                    )
                                  }
                                  className="p-2 hover:bg-accent"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>

                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  addToCart(
                                    product
                                  )
                                }
                                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                              >
                                Add
                              </button>
                            )}

                          </div>

                        </div>

                      </div>
                    );
                  }
                )
              )}

            </div>

          </section>

          {/* ================================== */}
          {/* CART */}
          {/* ================================== */}

          <aside className="lg:sticky lg:top-24 lg:h-fit">

            <div className="rounded-xl border bg-card">

              {/* Cart Header */}

              <div className="border-b p-5">

                <div className="flex items-center gap-2">

                  <ShoppingCart className="h-5 w-5" />

                  <h2 className="text-lg font-semibold">
                    Your Order
                  </h2>

                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Review your selected
                  products
                </p>

              </div>

              {/* Cart Items */}

              <div className="max-h-[400px] overflow-y-auto p-4">

                {cart.length === 0 ? (
                  <div className="py-10 text-center">

                    <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground" />

                    <p className="mt-3 font-medium">
                      Your cart is empty
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Add products from the
                      menu.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-3">

                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border p-3"
                      >

                        <div className="flex justify-between gap-3">

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              ₹{item.price} ×{" "}
                              {item.quantity}
                            </p>

                          </div>

                          <p className="text-sm font-semibold">
                            ₹
                            {item.price *
                              item.quantity}
                          </p>

                        </div>

                        <div className="mt-3 flex items-center justify-between">

                          <div className="flex items-center rounded-md border">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="p-1.5 hover:bg-accent"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>

                            <span className="w-7 text-center text-xs">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="p-1.5 hover:bg-accent"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.id
                              )
                            }
                            className="text-destructive hover:opacity-80"
                            aria-label="Remove product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* ================================== */}
              {/* ORDER SUMMARY */}
              {/* ================================== */}

              {cart.length > 0 && (
                <div className="border-t p-5">

                  {/* Subtotal */}

                  <div className="flex justify-between text-sm">

                    <span className="text-muted-foreground">
                      Subtotal
                    </span>

                    <span>
                      ₹{subtotal}
                    </span>

                  </div>

                  {/* Minimum Order Warning */}

                  {!minimumOrderReached && (
                    <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3">

                      <p className="text-center text-sm text-destructive">
                        Add ₹
                        {MINIMUM_ORDER_AMOUNT -
                          subtotal}{" "}
                        more to reach the
                        minimum order of ₹
                        {
                          MINIMUM_ORDER_AMOUNT
                        }.
                      </p>

                    </div>
                  )}

                  {/* Total */}

                  <div className="my-4 border-t" />

                  <div className="flex items-center justify-between">

                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-primary">
                      ₹{totalAmount}
                    </span>

                  </div>

                  {/* Checkout */}

                  <button
                    type="button"
                    disabled={
                      !minimumOrderReached
                    }
                    onClick={
                      handleCheckout
                    }
                    className="mt-5 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {minimumOrderReached
                      ? "Proceed to Checkout"
                      : `Minimum Order ₹${MINIMUM_ORDER_AMOUNT}`}
                  </button>

                </div>
              )}

            </div>

          </aside>

        </div>

      </div>

      {/* ====================================== */}
      {/* CHECKOUT DIALOG */}
      {/* ====================================== */}

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={
          setCheckoutOpen
        }
        customer={customer}
        cart={cart}
        subtotal={subtotal}
        totalAmount={totalAmount}
        token={token}
        onOrderPlaced={() => {
          setCart([]);
          setCheckoutOpen(false);
        }}
      />

    </main>
  );
}