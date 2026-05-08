import type { Metadata } from "next";
import { absoluteUrl, createPageMetadata, jsonLdScript } from "@/lib/seo";
import ProjectMarketplaceClient from "./project-marketplace-client";

export const metadata: Metadata = createPageMetadata({
  title: "Project Marketplace",
  description:
    "Explore public coding project definitions that can be launched in prepared student IDE workspaces.",
  path: "/project-marketplace",
});

export default function ProjectMarketplacePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "studentide Project Marketplace",
    url: absoluteUrl("/project-marketplace"),
    description:
      "Public coding project definitions for prepared classroom IDE sessions.",
  };

  return (
    <>
      <script type="application/ld+json">{jsonLdScript(jsonLd).__html}</script>
      <ProjectMarketplaceClient />
    </>
  );
}
