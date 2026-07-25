"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, X } from "lucide-react";

import { productSchema, ProductFormValues } from "@/schemas/productSchema";
import { toast } from "sonner";
import { createProductAction } from "@/actions/product.actions";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function ProductForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      available: true,
      image: "",
    },
  });

  async function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      const result = await createProductAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Product added successfully!");

      form.reset();

      router.push("/products");
    });
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle>Add Product</CardTitle>

        <CardDescription>
          Create a new product that customers can order through WhatsApp.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Name & Category */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>

              <Input
                id="name"
                placeholder="Boiled Egg"
                disabled={isPending}
                {...form.register("name")}
              />

              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>

              <Input
                id="category"
                placeholder="Egg"
                disabled={isPending}
                {...form.register("category")}
              />

              <p className="text-xs text-muted-foreground">
                Example: Egg, Chicken, Paneer
              </p>

              {form.formState.errors.category && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Price & Available */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>

                <Input
                  id="price"
                  type="number"
                  className="pl-8"
                  min={1}
                  disabled={isPending}
                  {...form.register("price", {
                    valueAsNumber: true,
                  })}
                />
              </div>

              {form.formState.errors.price && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Available for Ordering</Label>

                <p className="text-sm text-muted-foreground">
                  Customers can order this product.
                </p>
              </div>

              <Switch
                checked={form.watch("available")}
                onCheckedChange={(checked) =>
                  form.setValue("available", checked)
                }
                disabled={isPending}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              rows={5}
              placeholder="Fresh boiled egg"
              disabled={isPending}
              {...form.register("description")}
            />

            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Image Placeholder */}
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-lg font-medium">📷 Product Image</p>

            <p className="mt-2 text-sm text-muted-foreground">
              Image upload will be added in the next step.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => router.back()}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
