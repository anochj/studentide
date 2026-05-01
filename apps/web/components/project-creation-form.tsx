"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	createProjectDefinition,
	deregisterStarterFolder,
	getStarterFolderUploadSignedUrl,
} from "@/actions";
import {
	type Project,
	type ProjectInput,
	projectSchema,
} from "@/lib/validations/project";
import { MarkdownEditor } from "./markdown-editor";
import AccessSelector from "./project-creation/access-selector";
import { AvailabilitySelector } from "./project-creation/availability-selector";
import EnvironmentSelector from "./project-creation/environment-selector";
import StarterFileDropzone from "./project-creation/starter-files-dropzone";
import { Button } from "./ui/button";
// Components
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function ProjectCreationForm() {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		control,
		formState: { errors },
	} = useForm<ProjectInput, unknown, Project>({
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
		},
	});

	const handleOverviewMDDetected = useCallback(
		(content: string) => {
			setValue("overview", content, { shouldValidate: true });
		},
		[setValue],
	);

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log("Form Errors:", errors);
		}
	}, [errors]);

	const uploadStarterFolder = useMutation({
		mutationFn: async (file: { blob: Blob; name: string }) => {
			const signedUrlRes = await getStarterFolderUploadSignedUrl(
				file.name,
				file.blob.size,
			);
			if (!signedUrlRes.success) throw new Error(signedUrlRes.error);
			const { url, id } = signedUrlRes;
			if (!url || !id) throw new Error("Malformed response from server.");

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
		onSuccess: (data) => {
			console.log("Upload successful:", data);
		},
	});

	const removeStarterFolder = useMutation({
		mutationFn: async () => {
			const currentStarterFolderId = getValues("starter_folder_id");
			if (!currentStarterFolderId) {
				throw new Error("No starter folder to remove.");
			}

			const signedUrlRes = await deregisterStarterFolder(
				currentStarterFolderId,
			);
			if (!signedUrlRes.success) throw new Error(signedUrlRes.error);
		},
		onSuccess: (data) => {
			console.log("Upload successful:", data);
		},
	});

	const uploadProjectDefinition = useMutation({
		mutationFn: async (data: Project) => {
			const { success, error } = await createProjectDefinition(data);
			if (!success) throw new Error(`Project creation failed: ${error}`);
			return true;
		},
		onSuccess: (data) => {
			console.log("Project created successfully:", data);
		},
	});

	return (
		<form
			id="project-form"
			className="grid grid-cols-2 gap-4 p-4"
			onSubmit={handleSubmit((data) =>
				uploadProjectDefinition.mutateAsync(data),
			)}
		>
			<div className="flex flex-col gap-1">
				<Input
					id="projectName"
					type="text"
					placeholder="Project Name"
					{...register("name")}
				/>
				{errors.name && (
					<span className="text-red-500 text-sm">{errors.name.message}</span>
				)}
			</div>

			<Textarea
				id="projectDescription"
				placeholder="Project Description"
				{...register("description")}
			/>

			<Controller
				name="environment_id"
				control={control}
				render={({ field }) => (
					<EnvironmentSelector
						onChange={field.onChange}
						value={`${field.value}`}
					/>
				)}
			/>

			<Controller
				name="starter_folder_id"
				control={control}
				render={({ field }) => (
					<StarterFileDropzone
						onFolderUpload={async (
							{ blob, name },
							{ onProgress, onSuccess },
						) => {
							onProgress(0);
							const referenceId = await uploadStarterFolder.mutateAsync({
								blob,
								name,
							});
							field.onChange(referenceId);
							onProgress(100);
							onSuccess();
						}}
						onFolderRemove={removeStarterFolder.mutateAsync}
						onOverviewMDDetected={handleOverviewMDDetected}
					/>
				)}
			/>

			<Controller
				name="access"
				control={control}
				render={({ field }) => (
					<AccessSelector onChange={field.onChange} value={field.value} />
				)}
			/>

			<Controller
				name="availability"
				control={control}
				render={({ field }) => (
					<AvailabilitySelector
						onChange={field.onChange}
						onOpensAtChange={(date) => setValue("availability_opens", date)}
						onClosesAtChange={(date) => setValue("availability_closes", date)}
						value={field.value}
					/>
				)}
			/>

			<div className="col-span-2">
				<Controller
					name="overview"
					control={control}
					render={({ field }) => (
						<MarkdownEditor
							content={field.value}
							onContentChange={field.onChange}
						/>
					)}
				/>
			</div>

			<div className="col-span-2 flex justify-end mt-4">
				<Button type="submit">Create Project</Button>
			</div>
		</form>
	);
}
