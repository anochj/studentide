import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<main className="w-full">
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>
	);
}
