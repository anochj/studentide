import {
	Dropzone,
	DropZoneArea,
	DropzoneDescription,
	DropzoneMessage,
	DropzoneTrigger,
	useDropzone,
} from "../ui/dropzone";
import ignore from "ignore";
import JSZip from "jszip";
import { CloudUploadIcon, FolderArchiveIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";

type StarterFolderUploadResult =
	| {
			status: "success";
			result?: unknown;
	  }
	| {
			status: "error";
			error: string;
	  };

export interface StarterFileDropzoneProps {
	title?: string;
	description?: string;
	accept?: Record<string, string[]>;
	maxSize?: number;
	maxFiles?: number;
	onStarterFolderUpload: (file: File) => Promise<StarterFolderUploadResult>;
	onClearAll?: () => void; // Pass a function to clear the state if needed
}

const DEFAULT_IGNORE_PATTERNS = [".git", ".git/**", "**/.git", "**/.git/**"];

const getRootFolderName = (files: File[]) => {
	const firstFile = files[0] as File & { webkitRelativePath?: string };
	return firstFile?.webkitRelativePath?.split("/")[0] || "starter-folder";
};

const getFilePath = (file: File, rootFolderName: string) => {
	const fileWithPath = file as File & { webkitRelativePath?: string };
	const path = (fileWithPath.webkitRelativePath || file.name).replaceAll(
		"\\",
		"/",
	);
	const pathParts = path.split("/").filter(Boolean);

	if (pathParts[0] === rootFolderName) {
		return pathParts.slice(1).join("/");
	}

	return pathParts.join("/");
};

const getDirectoryPath = (filePath: string) => {
	const pathParts = filePath.split("/");
	pathParts.pop();
	return pathParts.join("/");
};

const getScopedPath = (filePath: string, directoryPath: string) => {
	if (directoryPath.length === 0) {
		return filePath;
	}

	if (filePath === directoryPath) {
		return "";
	}

	return filePath.startsWith(`${directoryPath}/`)
		? filePath.slice(directoryPath.length + 1)
		: undefined;
};

const createStarterFolderZip = async (files: File[]) => {
	const rootFolderName = getRootFolderName(files);
	const gitignoreMatchers = await Promise.all(
		files
			.map((file) => ({
				file,
				path: getFilePath(file, rootFolderName),
			}))
			.filter(
				({ path }) => path === ".gitignore" || path.endsWith("/.gitignore"),
			)
			.map(async ({ file, path }) => ({
				directoryPath: getDirectoryPath(path),
				matcher: ignore().add(await file.text()),
			})),
	);
	const defaultMatcher = ignore().add(DEFAULT_IGNORE_PATTERNS);

	const isIgnored = (filePath: string) =>
		defaultMatcher.ignores(filePath) ||
		gitignoreMatchers.some(({ directoryPath, matcher }) => {
			const scopedPath = getScopedPath(filePath, directoryPath);
			return scopedPath !== undefined && matcher.ignores(scopedPath);
		});

	const zip = new JSZip();

	for (const file of files) {
		const filePath = getFilePath(file, rootFolderName);

		if (filePath.length === 0 || isIgnored(filePath)) {
			continue;
		}
		console.log(`Adding file to zip: ${filePath}`);

		zip.file(filePath, file);
	}

	const zipBlob = await zip.generateAsync({
		type: "blob",
		compression: "DEFLATE",
		compressionOptions: { level: 6 },
	});

	return new File([zipBlob], `${rootFolderName}.zip`, {
		type: "application/zip",
		lastModified: Date.now(),
	});
};

export function StarterFileDropzone({
	title = "Upload Starter Folder",
	description = "The starter folder is automatically loaded into the IDE when the project is created.",
	accept,
	maxSize = 50 * 1024 * 1024, // Default to 50MB for folders
	maxFiles = 1000, // Higher limit for directories
	onStarterFolderUpload,
	onClearAll,
}: StarterFileDropzoneProps) {
	const dropzone = useDropzone<unknown, string>({
		onDropFiles: async (files) => {
			try {
				const zipFile = await createStarterFolderZip(files);
				const result = await onStarterFolderUpload(zipFile);

				if (result.status === "error") {
					return result;
				}

				return {
					status: "success",
					result: result.result,
				};
			} catch (error) {
				return {
					status: "error",
					error:
						error instanceof Error
							? error.message
							: "Failed to create starter folder zip",
				};
			}
		},
		directoryMode: true,
		validation: {
			accept,
			maxSize,
			maxFiles,
		},
	});

	// Compute a single summary for the entire uploaded folder
	const folderSummary = useMemo(() => {
		if (dropzone.fileStatuses.length === 0) return null;

		const totalSize = dropzone.fileStatuses.reduce(
			(acc, curr) => acc + curr.file.size,
			0,
		);
		const fileCount = dropzone.fileStatuses.length;

		// Extract root folder name from webkitRelativePath
		const firstFile = dropzone.fileStatuses[0]?.file as File & {
			webkitRelativePath?: string;
		};
		const folderName =
			firstFile?.webkitRelativePath?.split("/")[0] || "Uploaded Folder";

		const isUploading = dropzone.fileStatuses.some(
			(f) => f.status === "pending",
		);

		return { totalSize, fileCount, folderName, isUploading };
	}, [dropzone.fileStatuses]);

	return (
		<div className="not-prose flex flex-col gap-4">
			<Dropzone {...dropzone}>
				<div className="">
					<div className="flex justify-between">
						<DropzoneDescription>{description}</DropzoneDescription>
						<DropzoneMessage />
					</div>
					<DropZoneArea className="p-0 border-dashed">
						<DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm w-full">
							<CloudUploadIcon className="size-8" />
							<div>
								<p className="font-semibold">{title}</p>
								<p className="text-sm text-muted-foreground">
									Click here or drag and drop to upload
								</p>
							</div>
						</DropzoneTrigger>
					</DropZoneArea>
				</div>

				{/* Replaced individual file mapping with a unified folder summary */}
				{folderSummary && (
					<div className="mt-2 flex items-center justify-between overflow-hidden rounded-md bg-secondary p-4 shadow-sm border border-border">
						<div className="flex items-center gap-4 min-w-0">
							<FolderArchiveIcon className="size-8 shrink-0 text-blue-500" />
							<div className="min-w-0">
								<p className="truncate text-sm font-medium flex items-center gap-2">
									{folderSummary.folderName}
									{folderSummary.isUploading && (
										<span className="animate-pulse text-xs font-normal text-blue-500">
											Uploading...
										</span>
									)}
								</p>
								<p className="text-xs text-muted-foreground">
									{folderSummary.fileCount} files •{" "}
									{(folderSummary.totalSize / (1024 * 1024)).toFixed(2)} MB
									total
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={onClearAll}
							className="shrink-0 rounded-md p-2 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
						>
							<Trash2Icon className="size-4" />
						</button>
					</div>
				)}
			</Dropzone>
		</div>
	);
}
