"use client";

import { Globe, Link, Lock } from "lucide-react";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Project } from "@/lib/validations/project";

type ProjectVisibilitySelectorProps = {
	value: Project["access"];
	error?: string;
	onChange: (value: Project["access"]) => void;
};

const options = [
	{
		value: "private",
		title: "Private",
		description: "Your project will be visible only to you.",
		icon: Lock,
	},
	{
		value: "public",
		title: "Public",
		description: "Your project will be visible to everyone.",
		icon: Globe,
	},
	{
		value: "link",
		title: "Share by Link",
		description: "Your project will be visible to anyone with the link.",
		icon: Link,
	},
] satisfies Array<{
	value: Project["access"];
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
}>;

export function ProjectVisibilitySelector({
	value,
	error,
	onChange,
}: ProjectVisibilitySelectorProps) {
	return (
		<FieldSet>
			<FieldLegend>Visibility</FieldLegend>
			<FieldDescription>Choose the visibility of the project.</FieldDescription>
			<RadioGroup
				value={value}
				onValueChange={(nextValue) => onChange(nextValue as Project["access"])}
				className="flex w-full flex-col"
				aria-invalid={!!error}
			>
				{options.map((option) => {
					const Icon = option.icon;

					return (
						<FieldLabel htmlFor={`access-${option.value}`} key={option.value}>
							<Field orientation="horizontal">
								<FieldContent className="flex flex-row items-center gap-4">
									<Icon className="size-5 text-muted-foreground" />
									<div>
										<FieldTitle>{option.title}</FieldTitle>
										<FieldDescription>{option.description}</FieldDescription>
									</div>
								</FieldContent>
								<RadioGroupItem
									value={option.value}
									id={`access-${option.value}`}
								/>
							</Field>
						</FieldLabel>
					);
				})}
			</RadioGroup>
			<FieldError>{error}</FieldError>
		</FieldSet>
	);
}
