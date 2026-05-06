"use client";

import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { getAuthPageHref } from "@/lib/auth-redirect";
import { PLAN_LIMITS, Plans } from "@/lib/constants/stripe-configs";

export default function PlansPage() {
	const { data: session, isPending: isSessionLoading } =
		authClient.useSession();
	const currentSubscription = useSubscription(session?.user?.id);
	const isSignedOut = !session;

	const isBasic =
		!currentSubscription.isSuccess ||
		(!currentSubscription.data || currentSubscription.data.length === 0);
	const isLoading = isSessionLoading || currentSubscription.isLoading;

	const { free: FREE_LIMITS, plus_subscription: PLUS_LIMITS } = PLAN_LIMITS;
	const plusPlan = Plans.find((plan) => plan.lookupKey === "plus_subscription");

	const handleUpgrade = async () => {
		const { error } = await authClient.subscription.upgrade({
			plan: "Plus",
			successUrl: "/payment-successful",
			cancelUrl: "/plans",
			disableRedirect: false,
		});
		console.log(error);
	};

	const handleDowngrade = async () => {
        if (!currentSubscription.data || currentSubscription.data.length === 0) return;
        const subscriptionId = currentSubscription.data[0].stripeSubscriptionId;
		await authClient.subscription.cancel({
			subscriptionId: subscriptionId,
			returnUrl: "/plans",
		});
	};

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<main className="container mx-auto px-4 py-16 max-w-5xl">
			<header className="text-center mb-12">
				<h1 className="text-4xl font-bold tracking-tight mb-4">
					Choose Your Plan
				</h1>
				<p className="text-lg text-muted-foreground">
					Get the resources you need to build your next big project.
				</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
				<Card className="flex flex-col">
					<CardHeader>
						<CardTitle className="text-2xl">Free</CardTitle>
						<CardDescription>
							Everything you need to get started.
						</CardDescription>
						<div className="mt-4">
							<span className="text-4xl font-extrabold">$0</span>
							<span className="text-muted-foreground">/month</span>
						</div>
					</CardHeader>
					<CardContent className="flex-1">
						<ul className="space-y-3">
							<li className="flex items-center gap-3">
								<Check className="h-4 w-4 text-primary shrink-0" />
								<span>
									Up to <strong>{FREE_LIMITS.maxActiveIDESessions}</strong>{" "}
									active sessions
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Check className="h-4 w-4 text-primary shrink-0" />
								<span>
									<strong>{FREE_LIMITS.maxIDESessionLength} hrs</strong> per
									session
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Check className="h-4 w-4 text-primary shrink-0" />
								<span>
									<strong>{FREE_LIMITS.maxIDESessionStorage} GB</strong> per
									session
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Check className="h-4 w-4 text-primary shrink-0" />
								<span>
									<strong>{FREE_LIMITS.maxProjects}</strong> project definitions
								</span>
							</li>
						</ul>
					</CardContent>
					<CardFooter>
						<Button
							variant={isBasic ? "outline" : "secondary"}
							className="w-full h-12 text-base"
                            onClick={handleDowngrade}
							disabled={isBasic}
						>
							{isBasic ? "Current Plan" : "Downgrade to Free"}
						</Button>
					</CardFooter>
				</Card>

				<Card className="flex flex-col border-primary shadow-lg relative">
					<CardHeader>
						<CardTitle className="text-2xl">{plusPlan?.name}</CardTitle>
						{/* TODO: REMOVE IF USED FOR PROD */}
						<CardDescription>{plusPlan?.description}</CardDescription>
						<div className="mt-4">
							{/* Update this value based on your actual Stripe pricing */}
							<span className="text-4xl font-extrabold">$15</span>
							<span className="text-muted-foreground">
								{" "}
								/month (it's actually free)
							</span>
						</div>
					</CardHeader>
					<CardContent className="flex-1">
						<ul className="space-y-3">
							<li className="flex items-center gap-3">
								<Check className="h-4 w-4 text-primary shrink-0" />
								<span>
									Up to <strong>{PLUS_LIMITS.maxActiveIDESessions}</strong>{" "}
									active sessions
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Check className="h-4 w-4 text-primary shrink-0" />
								<span>
									<strong>{PLUS_LIMITS.maxIDESessionLength} hrs</strong> per
									session
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Check className="h-4 w-4 text-primary shrink-0" />
								<span>
									<strong>{PLUS_LIMITS.maxIDESessionStorage} GB</strong> per
									session
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Check className="h-4 w-4 text-primary shrink-0" />
								<span>
									<strong>{PLUS_LIMITS.maxProjects}</strong> project definitions
								</span>
							</li>
						</ul>
					</CardContent>
					<CardFooter>
						{isSignedOut ? (
							<Button className="w-full h-12 text-base" asChild>
								<Link href={getAuthPageHref("/signup", "/plans")}>
									Sign Up to Buy
								</Link>
							</Button>
						) : (
							<Button
								className="w-full h-12 text-base"
								disabled={!isBasic}
								onClick={handleUpgrade}
							>
								{!isBasic ? "Current Plan" : "Upgrade to Plus"}
							</Button>
						)}
					</CardFooter>
				</Card>
			</div>
		</main>
	);
}
