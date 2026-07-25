"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuToolbarProps {
  totalMenus: number;
}

export function MenuToolbar({
  totalMenus,
}: MenuToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search menu..."
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Categories
            </SelectItem>

            <SelectItem value="Breakfast">
              Breakfast
            </SelectItem>

            <SelectItem value="Curry">
              Curry
            </SelectItem>

            <SelectItem value="Snacks">
              Snacks
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground whitespace-nowrap">
          Total:{" "}
          <span className="font-semibold text-foreground">
            {totalMenus}
          </span>
        </div>
      </div>
    </div>
  );
}