"use client";

import { Receipt, Sparkle, User } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { UserProfileAvatar } from "@/components/user-profile-avatar";
import { useSubscription } from "@/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";

type UserAccountMenuProps = {
	variant?: "sidebar" | "navbar";
	side?: ComponentProps<typeof DropdownMenuContent>["side"];
	align?: ComponentProps<typeof DropdownMenuContent>["align"];
};

export function UserAccountMenu({
	variant = "sidebar",
	side = "top",
	align = "start",
}: UserAccountMenuProps) {
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user;
	const displayName = user?.name || "Student";
	const email =
		user?.email || (isPending ? "Loading profile..." : "Not signed in");
	const subscriptionQuery = useSubscription(user?.id);
	const subscriptionLabel = subscriptionQuery.isSuccess
		? subscriptionQuery.data.length > 0
			? "Plus"
			: "Free"
		: "Checking subscription...";

	const handleBillingPage = async () => {
		await authClient.subscription.billingPortal({
			returnUrl: window.location.href || "/",
			disableRedirect: false,
		});
	};

	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					{variant === "sidebar" ? (
						<SidebarMenuButton size="lg" tooltip={displayName}>
							<UserProfileAvatar
								email={email}
								image={user?.image}
								name={displayName}
							/>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{displayName}</span>
								<span className="truncate text-xs text-muted-foreground">
									{subscriptionLabel}
								</span>
							</div>
						</SidebarMenuButton>
					) : (
						<Button variant="outline" className="pl-1 py-5">
							<UserProfileAvatar
								email={email}
								image={user?.image}
								name={displayName}
							/>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{displayName}</span>
								<span className="truncate text-xs text-muted-foreground">
									{subscriptionLabel}
								</span>
							</div>

						</Button>
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align={align} side={side} className="min-w-44">
					<DropdownMenuGroup className="flex flex-row gap-2 p-2">
						<UserProfileAvatar
							email={email}
							image={user?.image}
							name={displayName}
						/>
						<div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{displayName}</span>
							<span className="truncate text-xs text-muted-foreground">
								{email}
							</span>
						</div>
					</DropdownMenuGroup>
					<DropdownMenuGroup>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DialogTrigger asChild>
							<DropdownMenuItem className="cursor-pointer">
								<User /> Profile
							</DropdownMenuItem>
						</DialogTrigger>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuLabel>Subscriptions</DropdownMenuLabel>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={handleBillingPage}
						>
							<Receipt /> Billing
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer" asChild>
							<Link href="/plans">
								<Sparkle /> Upgrade Plan
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Your Profile</DialogTitle>
					<DialogDescription>
						View your account details for Studentide.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center gap-3">
					<UserProfileAvatar
						className="size-16"
						email={email}
						image={user?.image}
						name={displayName}
					/>
					<div className="grid min-w-0 text-sm leading-tight">
						<span className="truncate font-medium">{displayName}</span>
						<span className="truncate text-muted-foreground">{email}</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
