import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import PlansClient from "./plans-client";

export const metadata: Metadata = createPageMetadata({
  title: "Plans",
  description:
    "Choose the studentide plan for prepared IDE sessions, project definitions, and classroom coding workflows.",
  path: "/plans",
});

export default function PlansPage() {
  return <PlansClient />;
}
