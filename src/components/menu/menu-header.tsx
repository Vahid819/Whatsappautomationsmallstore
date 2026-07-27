"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MenuHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <p className="text-muted-foreground">
          Manage your restaurant menu.
        </p>
      </div>

      <Button onClick={() => router.push("/products/add")}>        
        <Plus className="mr-2 h-4 w-4" />
        Add Menu
      </Button>
    </div>
  );
}