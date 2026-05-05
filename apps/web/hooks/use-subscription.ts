import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useSubscription(userId: string | undefined) {
	return useQuery({
		queryKey: ["subscriptions", userId],
		queryFn: async () => {
			if (!userId) return [];

			const subscriptions = await authClient.subscription.list({
				query: {
					referenceId: userId,
				},
			});

			if (subscriptions.error || !subscriptions.data) {
				throw new Error(
					subscriptions.error.message || "Failed to fetch subscriptions",
				);
			}

			return subscriptions.data;
		},
		enabled: !!userId,
	});
}
