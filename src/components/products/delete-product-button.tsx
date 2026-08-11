"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteProductAction } from "@/actions/product.actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({
  productId,
}: DeleteProductButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProductAction(productId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Product deleted successfully.");

      setOpen(false);

      router.refresh();
    });
  }

  return (
    <>
      {/* Delete menu item */}
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onSelect={(event) => {
          event.preventDefault();

          setOpen(true);
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />

        Delete
      </DropdownMenuItem>

      {/* Confirmation dialog */}
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this product?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This product
              will be permanently removed from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}