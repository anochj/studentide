import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		domains: ["api.dicebear.com", "studentide.com"],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
