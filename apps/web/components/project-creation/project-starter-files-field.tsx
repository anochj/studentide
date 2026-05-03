"use client";

import StarterFilesDropzone from "@/components/project-creation/starter-files-dropzone";
import {
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";

type ProjectStarterFilesFieldProps = {
	error?: string;
	onFolderUpload: Parameters<typeof StarterFilesDropzone>[0]["onFolderUpload"];
	onFolderRemove: Parameters<typeof StarterFilesDropzone>[0]["onFolderRemove"];
	onOverviewMDDetected: (content: string) => void;
};

export function ProjectStarterFilesField({
	error,
	onFolderUpload,
	onFolderRemove,
	onOverviewMDDetected,
}: ProjectStarterFilesFieldProps) {
	return (
		<FieldSet>
			<FieldLegend>Upload Starter Folder</FieldLegend>
			<FieldDescription>
				This folder will be used as the initial content of the project when the
				student first creates it.
			</FieldDescription>
			<FieldGroup>
				<StarterFilesDropzone
					onFolderUpload={onFolderUpload}
					onFolderRemove={onFolderRemove}
					onOverviewMDDetected={onOverviewMDDetected}
				/>
				<FieldError>{error}</FieldError>
			</FieldGroup>
		</FieldSet>
	);
}
