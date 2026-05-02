import stripe from "stripe";
import { Plans } from "@/lib/constants/stripe-configs";
import "dotenv/config";

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2026-04-22.dahlia",
});

async function seedStripe() {
	console.log("Starting Stripe seed...");

	for (const plan of Plans) {
		try {
			const existingPrices = await stripeClient.prices.list({
				lookup_keys: [plan.lookup_key],
                
			});

			if (existingPrices.data.length > 0) {
				console.log(
					`Plan '${plan.name}' already exists (Lookup Key: ${plan.lookup_key}). Skipping.`,
				);
				continue;
			}

			console.log(`Creating product and price for '${plan.name}'...`);

			const product = await stripeClient.products.create({
				name: plan.name,
				description: plan.description,
			});

			// 3. Create the Price and attach it to the new Product
			const price = await stripeClient.prices.create({
				product: product.id,
				unit_amount: plan.price,
				currency: "usd",
				recurring: {
					interval: "month",
				},
				lookup_key: plan.lookup_key,
			});

			console.log(`Success! Product ID: ${product.id} | Price ID: ${price.id}`);
		} catch (error) {
			console.error(`Failed to create plan '${plan.name}':`, error);
		}
	}

	console.log("Stripe seed complete.");
}

seedStripe();
