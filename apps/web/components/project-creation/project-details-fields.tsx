"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectInput } from "@/lib/validations/project";

type ProjectDetailsFieldsProps = {
	register: UseFormRegister<ProjectInput>;
	errors: FieldErrors<ProjectInput>;
};

export function ProjectDetailsFields({
	register,
	errors,
}: ProjectDetailsFieldsProps) {
	return (
		<FieldSet>
			<FieldLegend>Project Details</FieldLegend>
			<FieldDescription>
				Basic information to categorize your project.
			</FieldDescription>
			<FieldGroup>
				<Field data-invalid={!!errors.name}>
					<FieldLabel htmlFor="name">
						Name<span className="text-destructive">*</span>
					</FieldLabel>
					<Input
						id="name"
						autoComplete="off"
						placeholder="e.g. Web development starter kit"
						aria-invalid={!!errors.name}
						{...register("name")}
					/>
					<FieldError errors={[errors.name]} />
				</Field>
				<Field data-invalid={!!errors.description}>
					<FieldLabel htmlFor="description">Description</FieldLabel>
					<Textarea
						id="description"
						autoComplete="off"
						placeholder="e.g. A simple web development starter kit"
						aria-invalid={!!errors.description}
						{...register("description")}
					/>
					<FieldError errors={[errors.description]} />
				</Field>
			</FieldGroup>
		</FieldSet>
	);
}
