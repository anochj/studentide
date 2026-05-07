import PublicNavbar from "@/components/public-navbar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
}
