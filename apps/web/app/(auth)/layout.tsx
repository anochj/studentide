import { getServerSession } from "@/actions/utils";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();
	if (session) {
		redirect("/");
	}

	return <main className="w-full flex">{children}</main>;
}
