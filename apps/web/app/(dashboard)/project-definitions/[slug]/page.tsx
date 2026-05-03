import { getProjectView } from "@/actions";
import { getServerSession } from "@/actions/utils";
import ProjectDefinitionView from "@/components/project-definition-view";

export default async function ProjectsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const session = await getServerSession();

	const result = await getProjectView({ slug });
	if (result.serverError || result.validationErrors || !result.data?.success) {
		return (
			<div>Error: {result.serverError ?? "Failed to validate request"}</div>
		);
	}

	return (
		<ProjectDefinitionView
			project={result.data.project}
			creator={{
				name: session.user.name,
				icon: session.user.image,
			}}
			environment={result.data.project.environment}
		/>
	);
}
