import { MenuHeader } from "@/components/menu/menu-header";
import { MenuStats } from "@/components/menu/menu-stats";
import { MenuToolbar } from "@/components/menu/menu-toolbar";
import { MenuTable } from "@/components/menu/menu-table";

import { getMenus } from "@/services/dashboard/menu.service";

export default async function MenuPage() {
  const menus = await getMenus();

  return (
    <div className="space-y-6">
      <MenuHeader />

      <MenuStats menus={menus} />

      <MenuToolbar totalMenus={menus.length} />

      <MenuTable menus={menus} />
    </div>
  );
}