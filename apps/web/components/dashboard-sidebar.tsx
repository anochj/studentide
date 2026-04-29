"use client";

import {
	FolderKanban,
	GraduationCap,
	type LucideIcon,
	Send,
	TerminalSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

type DashboardNavItem = {
	title: string;
	href: string;
	icon: LucideIcon;
};

const dashboardNavItems: DashboardNavItem[] = [
	{
		title: "Projects",
		href: "/projects",
		icon: FolderKanban,
	},
	{
		title: "IDE Sessions",
		href: "/ide-sessions",
		icon: TerminalSquare,
	},
	{
		title: "Submissions",
		href: "/submissions",
		icon: Send,
	},
];

export function DashboardSidebar() {
	return (
		<Sidebar collapsible="icon">
			<DashboardSidebarHeader />
			<SidebarContent>
				<DashboardNav />
			</SidebarContent>
			<SidebarSeparator />
			<DashboardSidebarFooter />
		</Sidebar>
	);
}

function DashboardSidebarHeader() {
	return (
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild size="lg" tooltip="studentide_">
						<Link href="/projects">
							<div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
								<GraduationCap className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">studentide_</span>
								<span className="truncate text-xs text-muted-foreground">
									Dashboard
								</span>
							</div>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
}

function DashboardNav() {
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

function DashboardNavItem({
	item,
	isActive,
}: {
	item: DashboardNavItem;
	isActive: boolean;
}) {
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

function DashboardSidebarFooter() {
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user;
	const displayName = user?.name || "Student";
	const email =
		user?.email || (isPending ? "Loading profile..." : "Not signed in");
	const initials = getInitials(displayName, email);

	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" tooltip={displayName}>
						<Avatar className="size-8 rounded-md">
							<AvatarImage alt={displayName} src={user?.image ?? undefined} />
							<AvatarFallback className="rounded-md text-xs">
								{initials}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{displayName}</span>
							<span className="truncate text-xs text-muted-foreground">
								{email}
							</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
}

function isActivePath(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string, email: string) {
	const source = name !== "Student" ? name : email;
	const initials = source
		.split(/[^\p{L}\p{N}]+/u)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();

	return initials || "ST";
}
