"use client";

import { useQuery } from "@tanstack/react-query";
import { ImageIcon, RefreshCw } from "lucide-react";
import { getEnvironments } from "@/actions/environments";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";

type EnvironmentOption = {
	id: number;
	name: string;
	icon: string | null;
	description: string | null;
};

type ProjectEnvironmentSelectorProps = {
	value?: string | number;
	error?: string;
	onChange: (value: string) => void;
};

const environmentSkeletonIds = [
	"environment-skeleton-1",
	"environment-skeleton-2",
	"environment-skeleton-3",
	"environment-skeleton-4",
];

function getActionError(result: {
	serverError?: string;
	validationErrors?: {
		formErrors?: string[];
		fieldErrors?: Record<string, string[] | undefined>;
	};
}) {
	if (result.serverError) return result.serverError;

	const validationErrors = result.validationErrors;
	if (!validationErrors) return "Failed to load environments.";

	const fieldErrors = Object.values(validationErrors.fieldErrors ?? {}).flat();
	const messages = [
		...(validationErrors.formErrors ?? []),
		...fieldErrors,
	].filter((message): message is string => Boolean(message));

	return messages[0] ?? "Failed to load environments.";
}

export function ProjectEnvironmentSelector({
	value,
	error,
	onChange,
}: ProjectEnvironmentSelectorProps) {
	const environmentsQuery = useQuery({
		queryKey: ["environments"],
		queryFn: async () => {
			const result = await getEnvironments();

			if (result.serverError || result.validationErrors) {
				throw new Error(getActionError(result));
			}

			return result.data?.environments ?? [];
		},
	});

	return (
		<FieldSet>
			<FieldLegend>Development Environment</FieldLegend>
			<FieldDescription>
				Choose the environment the project will have.
			</FieldDescription>

			{environmentsQuery.isPending && (
				<div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
					{environmentSkeletonIds.map((id) => (
						<Skeleton key={id} className="h-20 w-full rounded-lg" />
					))}
				</div>
			)}

			{environmentsQuery.isError && (
				<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
					<p className="text-destructive text-sm">
						{environmentsQuery.error.message}
					</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="mt-3"
						onClick={() => environmentsQuery.refetch()}
					>
						<RefreshCw />
						Retry
					</Button>
				</div>
			)}

			{environmentsQuery.isSuccess && environmentsQuery.data.length === 0 && (
				<p className="rounded-lg border bg-muted/40 p-3 text-muted-foreground text-sm">
					No environments are available.
				</p>
			)}

			{environmentsQuery.isSuccess && environmentsQuery.data.length > 0 && (
				<RadioGroup
					value={value ? String(value) : ""}
					onValueChange={onChange}
					className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2"
					aria-invalid={!!error}
				>
					{environmentsQuery.data.map((environment) => (
						<EnvironmentOptionField
							key={environment.id}
							environment={environment}
						/>
					))}
				</RadioGroup>
			)}

			<FieldError>{error}</FieldError>
		</FieldSet>
	);
}

function EnvironmentOptionField({
	environment,
}: {
	environment: EnvironmentOption;
}) {
	const id = `environment-${environment.id}`;

	return (
		<FieldLabel htmlFor={id}>
			<Field orientation="horizontal">
				<FieldContent className="flex flex-row items-center gap-4">
					<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
						{environment.icon ? (
							<div
								className="size-7 object-contain"
								style={{
									backgroundImage: `url(${environment.icon})`,
									backgroundPosition: "center",
									backgroundRepeat: "no-repeat",
									backgroundSize: "contain",
								}}
							/>
						) : (
							<ImageIcon className="size-5 text-muted-foreground" />
						)}
					</div>
					<div>
						<FieldTitle>{environment.name}</FieldTitle>
						{environment.description && (
							<FieldDescription>{environment.description}</FieldDescription>
						)}
					</div>
				</FieldContent>
				<RadioGroupItem value={String(environment.id)} id={id} />
			</Field>
		</FieldLabel>
	);
}
