import PublicNavbar from "@/components/public-navbar";
import { SiteFooter } from "@/components/site-footer";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<PublicNavbar />
			{children}
			<SiteFooter />
		</>
	);
}
