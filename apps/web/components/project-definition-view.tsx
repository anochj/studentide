"use client";

import { useAction } from "next-safe-action/hooks";
import Markdown from "react-markdown";
import { launchIDESession } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Code2, Calendar, FileText, UserCircle } from "lucide-react";
import Image from "next/image";

type ProjectDefinitionViewProps = {
	project: {
		id: string;
		name: string;
		description: string | null;
		overview: string | null;
		availability_opens: Date | null;
		availability_closes: Date | null;
	};
	creator: {
		name: string;
		icon: string | null;
	};
	environment: {
		name: string;
		description: string;
		icon: string | null;
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
	creator,
	environment,
}: ProjectDefinitionViewProps) {
	const launchAction = useAction(launchIDESession);
	const opensAt = formatDate(project.availability_opens);
	const closesAt = formatDate(project.availability_closes);

	return (
		<main className="mx-auto w-full max-w-6xl p-6 lg:p-8">
			<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-12">
				<div className="lg:col-span-2">
					<div className="mb-8">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							{project.name}
						</h1>
						{project.description && (
							<p className="mt-3 text-lg text-muted-foreground">
								{project.description}
							</p>
						)}
					</div>

					<div className="prose prose-sm max-w-none dark:prose-invert md:prose-base bg-accent p-4">
						<Markdown>{project.overview || "No overview provided."}</Markdown>
					</div>
				</div>

				<div className="sticky top-8 flex flex-col gap-6 lg:col-span-1">
					<div className="flex flex-col gap-2">
						<Button
							size="lg"
							className="h-12 w-full gap-2 text-base font-semibold"
							onClick={async () => {
								launchAction.execute({ projectId: project.id });
							}}
							disabled={launchAction.isExecuting}
						>
							<Rocket className="h-5 w-5" />
							{launchAction.isExecuting ? "Launching..." : "Launch IDE"}
						</Button>

						{launchAction.result.serverError && (
							<p className="text-center text-sm font-medium text-destructive">
								{launchAction.result.serverError}
							</p>
						)}
						{launchAction.hasSucceeded && (
							<p className="text-center text-sm font-medium text-muted-foreground">
								Starting your workspace...
							</p>
						)}
					</div>

					<Card>
						<CardHeader className="pb-4">
							<CardTitle className="text-lg">Project details</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-6">
							<div className="flex items-start gap-4">
								<div className="mt-0.5 rounded-md bg-muted p-2 text-foreground">
									{environment.icon ? (
										<Image
											src={environment.icon}
											alt={environment.name}
											width={25}
											height={25}
										/>
									) : (
										<Code2 className="h-5 w-5" />
									)}
								</div>
								<div className="grid gap-1">
									<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
										Environment
									</p>
									<p className="text-sm font-medium leading-none">
										{environment.name}
									</p>
									{environment.description && (
										<p className="text-xs text-muted-foreground">
											{environment.description}
										</p>
									)}
								</div>
							</div>

							<div className="h-px bg-border" />

							<div className="flex items-start gap-4">
								<div className="mt-0.5 rounded-md bg-muted p-2 text-foreground">
									<Calendar className="h-5 w-5" />
								</div>
								<div className="grid gap-1">
									<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
										Availability
									</p>
									{opensAt || closesAt ? (
										<>
											{opensAt && (
												<p className="text-sm font-medium">Opens: {opensAt}</p>
											)}
											{closesAt && (
												<p className="text-sm font-medium text-muted-foreground">
													Closes: {closesAt}
												</p>
											)}
										</>
									) : (
										<p className="text-sm font-medium text-muted-foreground">
											Always open
										</p>
									)}
								</div>
							</div>

							<div className="h-px bg-border" />

							<div className="flex items-start gap-4">
								<div className="mt-0.5 rounded-md bg-muted p-2 text-muted-foreground">
									<FileText className="h-5 w-5" />
								</div>
								<div className="grid gap-1">
									<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
										Starter Files
									</p>
									<p className="text-sm font-medium text-muted-foreground">
										Included in workspace
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center gap-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
								{creator.icon ? (
									<Image
										src={creator.icon}
										alt={creator.name}
										className="h-full w-full rounded-full object-cover"
										width={40}
										height={40}
									/>
								) : (
									<UserCircle className="h-6 w-6 text-muted-foreground" />
								)}
							</div>
							<div className="grid gap-1">
								<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
									Created By
								</p>
								<p className="text-sm font-medium">{creator.name}</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
