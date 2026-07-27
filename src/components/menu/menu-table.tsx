"use client";

import { Menu } from "@/types/menu";

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

import { ImageOff, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface MenuTableProps {
  menus: Menu[];
}

export function MenuTable({ menus }: MenuTableProps) {
  if (!menus.length) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed">
        <ImageOff className="mb-4 h-14 w-14 text-muted-foreground" />

        <h2 className="text-xl font-semibold">No Products Found</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Start by adding your first product.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {menus.map((item) => (
            <TableRow key={item.id}>
              <TableCell>#{item.productNumber}</TableCell>

              <TableCell>
                <div>
                  <p className="font-medium">{item.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </TableCell>

              <TableCell>{item.category}</TableCell>

              <TableCell>₹{item.price}</TableCell>

              <TableCell>
                <Badge variant={item.available ? "default" : "secondary"}>
                  {item.available ? "Available" : "Unavailable"}
                </Badge>
              </TableCell>

              <TableCell>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-IN")
                  : "--"}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent">
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem className="text-destructive">
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
  );
}