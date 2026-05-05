"use client";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserAccountMenu } from "@/components/user-account-menu";

export function DashboardSidebarFooter() {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <UserAccountMenu side="top" variant="sidebar" />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
