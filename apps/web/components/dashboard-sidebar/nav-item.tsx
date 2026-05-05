import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { DashboardNavItem as DashboardNavItemData } from "./nav-items";

type DashboardNavItemProps = {
  item: DashboardNavItemData;
  isActive: boolean;
};

export function DashboardNavItem({ item, isActive }: DashboardNavItemProps) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.href}>
          <Icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
