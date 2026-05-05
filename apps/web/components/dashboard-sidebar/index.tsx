"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { DashboardNav } from "./nav";
import { DashboardSidebarFooter } from "./sidebar-footer";
import { DashboardSidebarHeader } from "./sidebar-header";

export function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarContent>
        <DashboardNav />
      </SidebarContent>
      <SidebarSeparator className="data-[orientation=horizontal]:w-auto"/>
      <DashboardSidebarFooter />
    </Sidebar>
  );
}
