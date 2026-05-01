"use server";

import { getServerSession } from "./utils";

export default async function launchIDESession(projectId: string) {
    // get project definition
    // launch ide session

    const session = await getServerSession();
    if (!session) return { success: false, error: "Unauthorized" };

    
}

