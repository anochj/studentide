"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	createProjectDefinition,
	deregisterStarterFolder,
	getStarterFolderUploadSignedUrl,
} from "@/actions";
import { ProjectAvailabilityField } from "@/components/project-creation/project-availability-field";
import { ProjectDetailsFields } from "@/components/project-creation/project-details-fields";
import { ProjectEnvironmentSelector } from "@/components/project-creation/project-environment-selector";
import { ProjectOverviewField } from "@/components/project-creation/project-overview-field";
import { ProjectStarterFilesField } from "@/components/project-creation/project-starter-files-field";
import { ProjectVisibilitySelector } from "@/components/project-creation/project-visibility-selector";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
	type Project,
	type ProjectInput,
	projectSchema,
} from "@/lib/validations/project";

type ActionErrorResult = {
	serverError?: string;
	validationErrors?: {
		formErrors?: string[];
		fieldErrors?: Record<string, string[] | undefined>;
	};
};

type FormErrors = ReturnType<
	typeof useForm<ProjectInput, unknown, Project>
>["formState"]["errors"] & {
	availability_times?: { message?: string };
};

function getActionError(result: ActionErrorResult) {
	if (result.serverError) return result.serverError;

	if (result.validationErrors) {
		const fieldErrors = Object.values(
			result.validationErrors.fieldErrors ?? {},
		).flat();
		const messages = [
			...(result.validationErrors.formErrors ?? []),
			...fieldErrors,
		].filter((message): message is string => Boolean(message));

		if (messages.length > 0) return messages.join(", ");
	}

	return "Action failed";
}

export function ProjectDefinitionCreateForm() {
	const queryClient = useQueryClient();
	const form = useForm<ProjectInput, unknown, Project>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			name: "",
			description: "",
			environment_id: "",
			access: "private",
			starter_folder_id: "",
			availability: "open",
			availability_closes: undefined,
			availability_opens: undefined,
			overview: "",
			extension_store_enabled: true,
		},
	});

	const {
		control,
		formState: { errors, isSubmitting },
		getValues,
		handleSubmit,
		register,
		setValue,
	} = form;
	const typedErrors = errors as FormErrors;

	const handleOverviewMDDetected = useCallback(
		(content: string) => {
			setValue("overview", content, {
				shouldDirty: true,
				shouldValidate: true,
			});
		},
		[setValue],
	);

	const uploadStarterFolder = useMutation({
		mutationFn: async (file: { blob: Blob; name: string }) => {
			const signedUrlRes = await getStarterFolderUploadSignedUrl({
				fileName: file.name,
				fileSize: file.blob.size,
			});

			if (signedUrlRes.serverError || signedUrlRes.validationErrors) {
				throw new Error(getActionError(signedUrlRes));
			}

			const { url, id } = signedUrlRes.data ?? {};
			if (!url || !id) {
				throw new Error("Malformed response from server.");
			}

			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/zip",
				},
				body: file.blob,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Upload failed: ${response.status} ${response.statusText} - ${errorText}`,
				);
			}

			return id;
		},
	});

	const removeStarterFolder = useMutation({
		mutationFn: async () => {
			const currentStarterFolderId = getValues("starter_folder_id");
			if (!currentStarterFolderId) return;

			const result = await deregisterStarterFolder({
				id: currentStarterFolderId,
			});

			if (result.serverError || result.validationErrors) {
				throw new Error(getActionError(result));
			}
		},
	});

	const createProject = useMutation({
		mutationFn: async (data: Project) => {
			const result = await createProjectDefinition(data);

			if (result.serverError || result.validationErrors) {
				throw new Error(`Project creation failed: ${getActionError(result)}`);
			}

			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["project-definitions"] });
		},
	});

	const isBusy =
		isSubmitting ||
		createProject.isPending ||
		uploadStarterFolder.isPending ||
		removeStarterFolder.isPending;

	return (
		<form
			className="grid grid-cols-1 gap-8 p-4 md:p-8 lg:grid-cols-5"
			onSubmit={handleSubmit((data) => createProject.mutateAsync(data))}
		>
			<div className="flex flex-col gap-6 lg:col-span-3">
				<ProjectDetailsFields register={register} errors={errors} />

				<Controller
					name="environment_id"
					control={control}
					render={({ field }) => (
						<ProjectEnvironmentSelector
							value={
								typeof field.value === "string" ||
								typeof field.value === "number"
									? field.value
									: ""
							}
							onChange={field.onChange}
							error={typedErrors.environment_id?.message}
						/>
					)}
				/>

				<Controller
					name="starter_folder_id"
					control={control}
					render={({ field }) => (
						<ProjectStarterFilesField
							error={typedErrors.starter_folder_id?.message}
							onOverviewMDDetected={handleOverviewMDDetected}
							onFolderUpload={async ({ blob, name }, events) => {
								try {
									events.onProgress(5);
									const referenceId = await uploadStarterFolder.mutateAsync({
										blob,
										name,
									});
									field.onChange(referenceId);
									events.onProgress(100);
									events.onSuccess();
								} catch (error) {
									const uploadError =
										error instanceof Error
											? error
											: new Error("Failed to upload starter folder.");
									events.onError(uploadError);
									throw uploadError;
								}
							}}
							onFolderRemove={async () => {
								await removeStarterFolder.mutateAsync();
								field.onChange("");
							}}
						/>
					)}
				/>

				<Controller
					name="overview"
					control={control}
					render={({ field }) => (
						<ProjectOverviewField
							value={field.value}
							onChange={field.onChange}
							error={typedErrors.overview?.message}
						/>
					)}
				/>
			</div>

			<div className="flex flex-col gap-6 lg:col-span-2 sticky top-8 self-start">
				<Controller
					name="access"
					control={control}
					render={({ field }) => (
						<ProjectVisibilitySelector
							value={field.value}
							onChange={field.onChange}
							error={typedErrors.access?.message}
						/>
					)}
				/>

				<Controller
					name="availability"
					control={control}
					render={({ field }) => (
						<ProjectAvailabilityField
							value={field.value}
							onChange={field.onChange}
							onOpensAtChange={(date) =>
								setValue("availability_opens", date, {
									shouldDirty: true,
									shouldValidate: true,
								})
							}
							onClosesAtChange={(date) =>
								setValue("availability_closes", date, {
									shouldDirty: true,
									shouldValidate: true,
								})
							}
							error={
								typedErrors.availability?.message ??
								typedErrors.availability_times?.message
							}
						/>
					)}
				/>

				<FieldSet>
					<FieldLegend>Extra Controls</FieldLegend>
					<FieldDescription>
						Additional controls to show in the IDE for this project.
					</FieldDescription>
					<Controller
						name="extension_store_enabled"
						control={control}
						render={({ field }) => (
							<Field orientation="horizontal" className="w-fit">
								<FieldLabel htmlFor="disable-extensions">
									Disable Extension Marketplace
								</FieldLabel>
								<Switch
									id="disable-extensions"
									checked={field.value === false}
									onCheckedChange={(checked) => field.onChange(!checked)}
								/>
							</Field>
						)}
					/>
				</FieldSet>

				{createProject.isError && (
					<div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm">
						<AlertCircle className="mt-0.5 size-4 shrink-0" />
						<p>{createProject.error.message}</p>
					</div>
				)}

				{createProject.isSuccess && (
					<div className="flex gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-primary text-sm">
						<CheckCircle2 className="mt-0.5 size-4 shrink-0" />
						<p>Project definition created.</p>
					</div>
				)}

				<div className="flex justify-end w-full">
					<Button className="w-full py-7" type="submit" disabled={isBusy || createProject.isSuccess}>
						{isBusy && <Loader2 className="animate-spin" />}
						{createProject.isSuccess ? "Created" : "Create Project"}
					</Button>
				</div>
			</div>
		</form>
	);
}
