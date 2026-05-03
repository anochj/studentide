import Link from "next/link";
import { getUserProjectDefinitions } from "@/actions";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";

export default async function ProjectsPage() {
	const result = await getUserProjectDefinitions();
	if (result.serverError || result.validationErrors || !result.data?.success) {
		return (
			<main className="flex min-h-dvh flex-col items-center justify-center gap-5 p-6 text-center">
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold">Failed to load projects</h1>
					<p className="max-w-sm text-muted-foreground text-sm">
						{result.serverError ?? "Failed to validate request"}
					</p>
				</div>
			</main>
		);
	}

	const { projects } = result.data;
	// const projects = [];

	return (
		<main className="h-screen">
			<h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-satoshi">
				Project Definitions
			</h1>

			<div className="h-full">
				{projects.length > 0 ? (
					<div className="flex gap-4">
						{projects.map(({ environment, project }) => (
							<Link
								href={`/project-definitions/${project.slug}`}
								key={project.id}
								className="w-xs"
							>
								<ProjectCard
									id={project.id}
									name={project.name}
									description={
										`${project.description} • ${environment.description}` ||
										"No description provided"
									}
									visibility={project.access}
									environment_name={environment.name}
									creation_date={project.created_at.toISOString()}
									icon={environment.icon || "default"}
								/>
							</Link>
						))}
					</div>
				) : (
					<div className="flex flex-col justify-center items-center gap-6 text-center h-full">
						<div className="space-y-2">
							<h1 className="text-2xl font-semibold">
								You have no project definitions yet
							</h1>
							<p className="max-w-sm text-muted-foreground text-sm">
								Try making one to start a workspace and launch IDE sessions.
							</p>
						</div>
						<Button asChild variant="default" size="lg">
							<Link href="/project-definitions/create">Create project</Link>
						</Button>
					</div>
				)}
			</div>
		</main>
	);
}
