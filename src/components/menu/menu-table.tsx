"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Menu } from "@/types/menu";

interface MenuTableProps {
  menus: Menu[];
}

export function MenuTable({ menus }: MenuTableProps) {
  if (menus.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-semibold">No menu items found</h3>
        <p className="mt-2 text-muted-foreground">
          Add your first menu item to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {menus.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.name}
              </TableCell>

              <TableCell>{item.category}</TableCell>

              <TableCell>₹{item.price}</TableCell>

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

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}