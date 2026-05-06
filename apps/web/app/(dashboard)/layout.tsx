import { getServerSession } from "@/actions/utils";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getAuthPageHref } from "@/lib/auth-redirect";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();

	if (!session) {
		redirect(getAuthPageHref("/login", "/project-definitions"));
	}

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
