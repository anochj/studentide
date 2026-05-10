import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/plans", "/project-marketplace", "/project/"],
      disallow: [
        "/api/",
        "/login",
        "/signup",
        "/project-definitions",
        "/ide-sessions",
        "/submissions",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
