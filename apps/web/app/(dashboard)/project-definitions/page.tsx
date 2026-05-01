import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserProjectDefinitions } from "@/actions";
import { Card, CardHeader } from "@/components/ui/card";

export default async function ProjectsPage() {
	const { success, error, projects } = await getUserProjectDefinitions();
	if (!success) {
		return (
			<main className="flex min-h-dvh flex-col items-center justify-center gap-5 p-6 text-center">
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold">Failed to load projects</h1>
					<p className="max-w-sm text-muted-foreground text-sm">{error}</p>
				</div>
			</main>
		);
	}

	return (
		<main className="flex min-h-dvh flex-col items-center justify-center gap-5 p-6 text-center">
			{projects?.map((project) => (
				<Link href={`/project-definitions/${project.slug}`} key={project.id} className="w-full">
					<Card className="w-full">
						<CardHeader>
							<h2 className="text-lg font-semibold">{project.name}</h2>
							<p className="text-sm text-muted-foreground">
								{project.description}
							</p>
						</CardHeader>
					</Card>
				</Link>
			))}
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold">You have no projects yet</h1>
				<p className="max-w-sm text-muted-foreground text-sm">
					Try making one to start a workspace and launch IDE sessions.
				</p>
			</div>
			<Button asChild>
				<Link href="/project-definitions/create">Create project</Link>
			</Button>
		</main>
	);
}
