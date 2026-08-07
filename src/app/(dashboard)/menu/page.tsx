export const dynamic = "force-dynamic";

import { MenuHeader } from "@/components/menu/menu-header";
import { MenuStats } from "@/components/menu/menu-stats";
import { MenuTable } from "@/components/menu/menu-table";

import { getMenus } from "@/services/dashboard/menu.service";
import { Menu } from "@/types/menu";


export default async function MenuPage() {

  const menus = await getMenus();

  return (
    <div className="space-y-6">
      <MenuHeader />

      <MenuStats menus={menus} />

      <MenuTable menus={menus} />
    </div>
  );
}