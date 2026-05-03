"use server";

import { db } from "@/db";
import { environments } from "@/db/schema";
import { authActionClient } from "./utils";

export const getEnvironments = authActionClient.action(async () => {
  const environmentsList = await db
    .select({
      id: environments.id,
      name: environments.name,
      icon: environments.icon,
      description: environments.description,
    })
    .from(environments);

  return { success: true, environments: environmentsList };
});
