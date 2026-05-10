import type { MetadataRoute } from "next";
import { getSitemapPublicProjects } from "@/lib/project-seo";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicProjects = await getSitemapPublicProjects();
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/project-marketplace"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/plans"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...publicProjects.map((project) => ({
      url: absoluteUrl(`/project/${project.slug}`),
      lastModified: project.updatedAt ?? project.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
