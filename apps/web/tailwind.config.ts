import type { Config } from "tailwindcss";

const config = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./lib/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				satoshi: ["var(--font-satoshi)"],
				// Or override the default sans stack
				sans: ["var(--font-satoshi)", "ui-sans-serif", "system-ui"],
			},
		},
	},
} satisfies Config;

export default config;
