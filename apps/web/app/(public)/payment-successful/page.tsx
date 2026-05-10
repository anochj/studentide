import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserSubscription } from "@/actions/utils";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Payment Successful",
  description: "Your studentide subscription has been activated.",
  path: "/payment-successful",
  noIndex: true,
});

export default async function PaymentSuccessfulPage() {
  const sub = await getUserSubscription();
  if (!sub) redirect("/plans");

  // only allow them to see this page if they just bought it
  if (sub.subscription?.periodStart) {
    const diff = Date.now() - sub.subscription.periodStart.getTime();
    if (diff > 24 * 60 * 1000) redirect("/plans");
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p className="text-center text-muted-foreground">
        Thank you for your purchase. Your subscription has been activated.
      </p>
      <Button asChild>
        <Link href="/project-definitions">Start Developing</Link>
      </Button>
    </div>
  );
}
