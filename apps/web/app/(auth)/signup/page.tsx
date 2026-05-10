import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import SignupClient from "./signup-client";

export const metadata: Metadata = createPageMetadata({
  title: "Create Account",
  description:
    "Create a studentide account to build coding project definitions and launch prepared IDE sessions.",
  path: "/signup",
  noIndex: true,
});

export default function SignupPage() {
  return <SignupClient />;
}
