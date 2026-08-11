"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Menu } from "@/types/menu";
import { deleteProductAction } from "@/actions/product.actions";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface MenuTableProps {
  menus: Menu[];
}

export function MenuTable({ menus }: MenuTableProps) {
  const router = useRouter();

  const [deleteProductId, setDeleteProductId] = useState<string | null>(
    null
  );

  const [isPending, startTransition] = useTransition();

  function handleDelete() {
  if (!deleteProductId) return;

  startTransition(async () => {
    const result = await deleteProductAction(
      deleteProductId
    );

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Product deleted successfully.");

    setDeleteProductId(null);

    router.refresh();
  });
}

  if (!menus.length) {
    return (
      <div className="rounded-lg border p-10 text-center">
        <h2 className="text-xl font-semibold">
          No Products Found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Start by adding your first product.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>

              <TableHead>Product</TableHead>

              <TableHead>Category</TableHead>

              <TableHead>Price</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Created</TableHead>

              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {menus.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  #{item.productNumber}
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  {item.category}
                </TableCell>

                <TableCell>
                  ₹{item.price}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      item.available
                        ? "default"
                        : "secondary"
                    }
                  >
                    {item.available
                      ? "Available"
                      : "Unavailable"}
                  </Badge>
                </TableCell>

                <TableCell>
                  {item.createdAt
                    ? new Date(
                        item.createdAt
                      ).toLocaleDateString("en-IN")
                    : "--"}
                </TableCell>

                <TableCell className="text-right">
  <DropdownMenu>
    <DropdownMenuTrigger
      className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
    >
      <MoreHorizontal className="h-4 w-4" />
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      {/* EDIT */}
      <DropdownMenuItem>
        <Link
          href={`/dashboard/products/${item.id}/edit`}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </DropdownMenuItem>

      {/* DELETE */}
      <DropdownMenuItem
  className="text-destructive focus:text-destructive"
  onClick={() => {
    setDeleteProductId(item.id);
  }}
>
  <Trash2 className="mr-2 h-4 w-4" />
  Delete
</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ========================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ========================================= */}

     <AlertDialog
  open={deleteProductId !== null}
  onOpenChange={(open) => {
    if (!open && !isPending) {
      setDeleteProductId(null);
    }
  }}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Delete Product?
      </AlertDialogTitle>

      <AlertDialogDescription>
        This action cannot be undone. This product will
        be permanently deleted.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel disabled={isPending}>
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        disabled={isPending}
        onClick={handleDelete}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </>
        )}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </>
  );
}