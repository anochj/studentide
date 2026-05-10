import { desc, eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { environments, projects, user } from "@/db/schema";

export const getProjectSeoData = cache(async (slug: string) => {
  const [row] = await db
    .select({
      project: projects,
      environment: environments,
      owner: {
        name: user.name,
        image: user.image,
      },
    })
    .from(projects)
    .where(eq(projects.slug, slug))
    .leftJoin(environments, eq(projects.environment_id, environments.id))
    .leftJoin(user, eq(projects.user_id, user.id));

  return row ?? null;
});

export async function getSitemapPublicProjects() {
  return db
    .select({
      slug: projects.slug,
      updatedAt: projects.updated_at,
      createdAt: projects.created_at,
    })
    .from(projects)
    .where(eq(projects.access, "public"))
    .orderBy(desc(projects.updated_at));
}
