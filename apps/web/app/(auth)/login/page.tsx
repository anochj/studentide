import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import LoginClient from "./login-client";

export const metadata: Metadata = createPageMetadata({
  title: "Log In",
  description:
    "Log in to studentide to manage coding projects, launch IDE sessions, and review submissions.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return <LoginClient />;
}
