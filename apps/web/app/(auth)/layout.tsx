import { redirect } from "next/navigation";
import { getServerSession } from "@/actions/utils";
import { DEFAULT_AUTH_REDIRECT_PATH } from "@/lib/auth-redirect";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (session) {
    redirect(DEFAULT_AUTH_REDIRECT_PATH);
  }

  return <main className="w-full flex">{children}</main>;
}
