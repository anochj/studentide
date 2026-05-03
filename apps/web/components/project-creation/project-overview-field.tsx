"use client";

import type { Content } from "@tiptap/react";
import { MarkdownEditor } from "@/components/project-creation/markdown-editor";
import {
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";

type ProjectOverviewFieldProps = {
	value?: string;
	error?: string;
	onChange: (value: string) => void;
};

function contentToString(content: Content): string {
	if (typeof content === "string") return content;
	return JSON.stringify(content);
}

export function ProjectOverviewField({
	value,
	error,
	onChange,
}: ProjectOverviewFieldProps) {
	return (
		<FieldSet>
			<FieldLegend>Overview</FieldLegend>
			<FieldDescription>
				Enter the project outline. This will be visible to students and can
				include instructions, resources, and any other relevant information.
			</FieldDescription>
			<FieldGroup>
				<MarkdownEditor
					content={value}
					onContentChange={(content) => onChange(contentToString(content))}
				/>
				<FieldError>{error}</FieldError>
			</FieldGroup>
		</FieldSet>
	);
}
