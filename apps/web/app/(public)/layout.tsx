import PublicNavbar from "@/components/public-navbar";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <PublicNavbar />
            <main className="w-full">
                {children}
            </main>
        </>
    );
}
