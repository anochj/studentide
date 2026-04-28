"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { beginIdeSession } from "@/app/actions";

export default function IdeLaunchPage() {
    const [taskArn, setTaskArn] = useState("");
    const [projectId, setProjectId] = useState("");

	return (
		<main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
            <Input
                placeholder="Task Definition ARN"
                value={taskArn}
                onChange={(e) => setTaskArn(e.target.value)}
            />
            <Input
                placeholder="Project ID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
            />
            <Button onClick={() => beginIdeSession(taskArn, projectId)}>
                Launch IDE Session
            </Button>
		</main>
	);
}
