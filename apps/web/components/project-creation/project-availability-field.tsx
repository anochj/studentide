"use client";

import { AvailabilitySelector } from "@/components/project-creation/availability-selector";
import {
	FieldDescription,
	FieldError,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import type { Project } from "@/lib/validations/project";

type ProjectAvailabilityFieldProps = {
	value: Project["availability"];
	error?: string;
	onChange: (value: Project["availability"]) => void;
	onOpensAtChange: (value: Date | undefined) => void;
	onClosesAtChange: (value: Date | undefined) => void;
};

export function ProjectAvailabilityField({
	value,
	error,
	onChange,
	onOpensAtChange,
	onClosesAtChange,
}: ProjectAvailabilityFieldProps) {
	return (
		<FieldSet>
			<FieldLegend>Availability</FieldLegend>
			<FieldDescription>
				Choose the availability of the project.
			</FieldDescription>
			<AvailabilitySelector
				value={value}
				onChange={onChange}
				onOpensAtChange={onOpensAtChange}
				onClosesAtChange={onClosesAtChange}
			/>
			<FieldError>{error}</FieldError>
		</FieldSet>
	);
}
