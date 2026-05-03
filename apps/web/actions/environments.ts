"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { authActionClient } from "./utils";
import { environments } from "@/db/schema";

export const getEnvironments = authActionClient.action(async ({ ctx }) => {
	const environmentsList = db.select({
        id: environments.id,
        name: environments.name,
        icon: environments.icon,
        description: environments.description,

    }).from(environments);

	return { success: true, environments: environmentsList };
});
