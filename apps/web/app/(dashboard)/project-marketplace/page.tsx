"use client";

import { queryProjectMarketplace } from "@/actions";
import { Input } from "@/components/ui/input";

export default function ProjectMarketplacePage() {
    

	return (
		<div className="w-full">
			<h1 className="scroll-m-20 border-b pb-2 font-satoshi font-semibold text-3xl tracking-tight first:mt-0">
				Project Marketplace
			</h1>
			<Input
				placeholder="Search for projects..."
				onChange={async (event) => {
					const query = event.currentTarget.value.trim();
					if (!query) {
						console.log([]);
						return;
					}

					const results = await queryProjectMarketplace({
						query,
						maxResults: 10,
					});

					console.log(results);
				}}
			/>
		</div>
	);
}
