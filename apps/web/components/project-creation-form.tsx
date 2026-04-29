"use client";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Input } from "./ui/input";
import { MarkdownEditor } from "./markdown-editor";
import { AvailabilitySelector } from "./project-creation/availability-selector";
import { StarterFileDropzone } from "./project-creation/starter-files-dropzone";

export function ProjectCreationForm() {
	const projects = [
		{
			name: "Python",
			description:
				"A starter project with Python and essential libraries pre-installed.",
			icon: "https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg",
		},
		{
			name: "Web Development",
			description:
				"A starter project with Python and essential libraries pre-installed.",
			icon: "https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg",
		},
		{
			name: "C/C++",
			description:
				"A starter project with Python and essential libraries pre-installed.",
			icon: "https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg",
		},
		{
			name: "",
			description:
				"A starter project with Python and essential libraries pre-installed.",
			icon: "https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg",
		},
	];

	return (
		<form>
			<RadioGroup defaultValue="plus" className="w-full flex">
				{projects.map((project) => (
					<FieldLabel htmlFor={project.name} key={project.name}>
						<Field orientation="horizontal">
							<FieldContent className="flex flex-row items-center justify-center gap-4">
								<Image
									src={project.icon}
									alt="Python Logo"
									width={50}
									height={50}
								/>
								<div>
									<FieldTitle>{project.name}</FieldTitle>
									<FieldDescription>{project.description}</FieldDescription>
								</div>
							</FieldContent>
							<RadioGroupItem value={project.name} id={project.name} />
						</Field>
					</FieldLabel>
				))}
			</RadioGroup>

			<Field>
				<FieldLabel htmlFor="projectName">Name</FieldLabel>
				<Input id="projectName" type="text" placeholder="Project Name" />
				<FieldDescription>Your project name.</FieldDescription>
			</Field>

			<Field>
				<FieldLabel htmlFor="projectDescription">Description</FieldLabel>
				<Input
					id="projectDescription"
					type="text"
					placeholder="Project Description"
				/>
				<FieldDescription>Your project description.</FieldDescription>
			</Field>

			{/* TODO: Add https://uiwjs.github.io/react-md-editor/ */}
			<StarterFileDropzone
				title="Upload React Template"
				description="Select your standard project structure to initialize the workspace."
				onStarterFolderUpload={async (file) => {
					return { status: "success", result: file };
				}}
				onClearAll={() => {
					// Clear your external state or reset the hook
				}}
			/>

			<MarkdownEditor />

			<AvailabilitySelector />
		</form>
	);
}
