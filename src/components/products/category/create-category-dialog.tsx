"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  categorySchema,
  CategoryFormValues,
} from "@/schemas/category.schema";

import { createCategoryAction } from "@/actions/category.actions";

import { toast } from "sonner";
import { Category } from "@/types/category";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated?: (category: Category) => void;
}

const icons = [
  "🥚",
  "🧀",
  "🥛",
  "🍗",
  "🥩",
  "🐟",
  "🥬",
  "🍎",
  "🍞",
  "📦",
];

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCategoryCreated,
}: CreateCategoryDialogProps) {
  const [selectedIcon, setSelectedIcon] =
    useState("📦");

  const [isPending, startTransition] =
    useTransition();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),

    defaultValues: {
      name: "",
      icon: "📦",
    },
  });
async function onSubmit(values: CategoryFormValues) {
  startTransition(async () => {
    const result = await createCategoryAction(
  values.name,
  values.icon
);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    // Notify parent component
    if (result.success && result.category) {
  onCategoryCreated?.(result.category);
}

    form.reset();

    setSelectedIcon("📦");

    onOpenChange(false);
  });
}

    return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Category
          </DialogTitle>

          <DialogDescription>
            Add a new category for products.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label>Category Name</Label>

            <Input
              placeholder="Eggs"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {
                  form.formState.errors.name
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Select Icon</Label>

            <div className="grid grid-cols-5 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    setSelectedIcon(icon);

                    form.setValue("icon", icon);
                  }}
                  className={`rounded-lg border p-3 text-2xl transition

                  ${
                    selectedIcon === icon
                      ? "border-primary bg-primary/10"
                      : ""
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : "Save Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}