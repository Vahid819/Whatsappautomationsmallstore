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
    ({ available }) => available
  ).length;

  const unavailableItems = totalItems - availableItems;

  const totalCategories = new Set(
    menus
      .map(({ category }) => category.trim())
      .filter(Boolean)
  ).size;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Products"
        value={totalItems}
        icon={UtensilsCrossed}
        description="Products in menu"
      />

      <StatsCard
        title="Available"
        value={availableItems}
        icon={CheckCircle2}
        description="Visible to customers"
      />

      <StatsCard
        title="Unavailable"
        value={unavailableItems}
        icon={XCircle}
        description="Hidden from menu"
      />

      <StatsCard
        title="Categories"
        value={totalCategories}
        icon={FolderTree}
        description="Product categories"
      />
    </section>
  );
}