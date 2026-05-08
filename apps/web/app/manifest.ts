import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "studentide",
    short_name: "studentide",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.themeColor,
    theme_color: siteConfig.themeColor,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "1024x1024",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}
