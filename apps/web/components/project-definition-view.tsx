"use client";

import { useAction } from "next-safe-action/hooks";
import Markdown from "react-markdown";
import { launchIDESession } from "@/actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type ProjectDefinitionViewProps = {
	project: {
		id: string;
		name: string;
		description: string | null;
		overview: string | null;
		availability_opens: Date | null;
		availability_closes: Date | null;
	};
};

function formatDate(date: Date | null) {
	if (!date) return null;

	return new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

export default function ProjectDefinitionView({
	project,
}: ProjectDefinitionViewProps) {
	const launchAction = useAction(launchIDESession);
	const opensAt = formatDate(project.availability_opens);
	const closesAt = formatDate(project.availability_closes);

	return (
		<main className="mx-auto w-full max-w-3xl p-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">{project.name}</CardTitle>
					{project.description ? (
						<CardDescription>{project.description}</CardDescription>
					) : null}
					<CardAction>
						<Button
                            type="button"
							onClick={async () => {
                                console.log("Launching IDE session for project:", project.id);
                                const result = await launchAction.execute({ projectId: project.id });
                                console.log("Launch action result:", result);
                            }}
							disabled={launchAction.isExecuting}
						>
							{launchAction.isExecuting ? "Launching..." : "Launch IDE"}
						</Button>
					</CardAction>
				</CardHeader>

				<CardContent className="space-y-4">
					{opensAt || closesAt ? (
						<p className="text-sm text-muted-foreground">
							{opensAt ? `Opens ${opensAt}` : "Open now"}
							{closesAt ? ` - Closes ${closesAt}` : ""}
						</p>
					) : null}

					<div className="prose prose-sm max-w-none dark:prose-invert">
						<Markdown>{project.overview || "No overview provided."}</Markdown>
					</div>

					{launchAction.result.serverError ? (
						<p className="text-sm text-destructive">
							{launchAction.result.serverError}
						</p>
					) : null}

					{launchAction.hasSucceeded ? (
						<p className="text-sm text-muted-foreground">
							IDE session launch started.
						</p>
					) : null}
				</CardContent>
			</Card>
		</main>
	);
}
