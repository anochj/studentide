import { getProjectView } from "@/actions";
import { getServerSession } from "@/actions/utils";
import ProjectDefinitionView from "@/components/project-definition-view";

export default async function ProjectsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const result = await getProjectView({ slug });
	if (result.serverError || result.validationErrors || !result.data?.success) {
		return (
			<div>Error: {result.serverError ?? "Failed to validate request"}</div>
		);
	}

	return (
		<ProjectDefinitionView
			project={{
				...result.data.project,
				starter_folder_included: !!result.data.project.starter_folder_id,
			}}
			creator={{
				name: result.data.project.owner?.name || "",
				icon: result.data.project.owner?.icon || "",
			}}
			environment={result.data.project.environment}
		/>
	);
}
