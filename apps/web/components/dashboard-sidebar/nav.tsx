"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { DashboardNavItem } from "./nav-item";
import { dashboardNavItems } from "./nav-items";
import { isActivePath } from "./utils";

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {dashboardNavItems.map((item) => (
            <DashboardNavItem
              isActive={isActivePath(pathname, item.href)}
              item={item}
              key={item.href}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
