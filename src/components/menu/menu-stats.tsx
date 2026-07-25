"use client";

import {
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  FolderTree,
} from "lucide-react";

import { Menu } from "@/types/menu";
import { StatsCard } from "./stats-card";

interface MenuStatsProps {
  menus: Menu[];
}

export function MenuStats({ menus }: MenuStatsProps) {
  const totalItems = menus.length;

  const availableItems = menus.filter(
    (menu) => menu.available
  ).length;

  const unavailableItems = totalItems - availableItems;

  const totalCategories = new Set(
    menus.map((menu) => menu.category)
  ).size;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Items"
        value={totalItems}
        icon={UtensilsCrossed}
        description="Menu items"
      />

      <StatsCard
        title="Available"
        value={availableItems}
        icon={CheckCircle2}
        description="Ready to order"
      />

      <StatsCard
        title="Out of Stock"
        value={unavailableItems}
        icon={XCircle}
        description="Currently unavailable"
      />

      <StatsCard
        title="Categories"
        value={totalCategories}
        icon={FolderTree}
        description="Food categories"
      />
    </div>
  );
}