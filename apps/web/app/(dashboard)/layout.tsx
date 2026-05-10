import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Workspace",
  description: "Manage project definitions, IDE sessions, and submissions.",
  path: "/project-definitions",
  noIndex: true,
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full flex">
        <SidebarTrigger className="text-start items-start p-2" />
        {children}
      </main>
    </SidebarProvider>
  );
}
