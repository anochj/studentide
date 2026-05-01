"use client";
import { ProjectCreationForm } from "@/components/project-creation-form";
import { Button } from "@/components/ui/button";

export default function CreateProjectPage() {
	return (
		<div className="w-full">
			<Button type="submit" form="project-form" variant="default">
				Create Project
			</Button>
			<ProjectCreationForm />
		</div>
	);
}
