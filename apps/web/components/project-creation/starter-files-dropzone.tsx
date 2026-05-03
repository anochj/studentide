import ignore from "ignore";
import JSZip from "jszip";
import { Folder, Upload, X } from "lucide-react";
import { useState } from "react";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const DEFAULT_FILE_IGNORES = [
  // Version Control
  ".git/",

  // OS Files
  ".DS_Store",
  "Thumbs.db",
  "desktop.ini",

  // Dependencies
  "node_modules/",
  "bower_components/",
  "jspm_packages/",

  // Environments & Secrets
  ".env",
  ".env.*",
  "*.env",
  ".venv/",
  "venv/",
  "env/",
  "ENV/",

  // Python Cache
  "__pycache__/",
  "*.py[cod]",
  "*$py.class",
  ".pytest_cache/",

  // Build Outputs & IDEs
  "dist/",
  "build/",
  "out/",
  "target/", // Java/Rust
  ".vscode/",
  ".idea/",
  "*.suo",
  "*.ntvs*",
  "*.njsproj",
  "*.sln",

  // Logs & Temporary
  "*.log",
  "*.tmp",
  "*.swp",
  ".cache/",
  ".sass-cache/",
  "npm-debug.log*",
  "yarn-debug.log*",
  "yarn-error.log*",
];

type StarterFilesDropzoneProps = {
  initStarterFolder?: Blob | null;
  initStarterName?: string | null;
  overviewMdMatches?: string[];
  onFolderUpload?: (
    folder: {
      blob: Blob;
      name: string;
    },
    events: {
      onProgress: (progress: number) => void;
      onSuccess: (result?: unknown) => void;
      onError: (error: Error) => void;
    },
  ) => void | Promise<void>;
  onFolderRemove?: () => void | Promise<void>;
  onOverviewMDDetected?: (content: string) => void;
};

export default function StarterFilesDropzone({
  initStarterFolder,
  initStarterName,
  overviewMdMatches = ["overview.md", "readme.md"],
  onFolderUpload,
  onFolderRemove,
  onOverviewMDDetected,
}: StarterFilesDropzoneProps) {
  const [starterFolder, setStarterFolder] = useState<Blob | null>(
    initStarterFolder || null,
  );
  const [folderName, setFolderName] = useState<string | null>(
    initStarterName || null,
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <FileUpload
      onUpload={async (files) => {
        const zip = new JSZip();
        const gitignore = ignore().add(DEFAULT_FILE_IGNORES);
        let overviewFound = false;

        const folderName = files[0].webkitRelativePath.split("/")[0];

        const subdirGitignores = files
          .filter((file) => file.webkitRelativePath.endsWith(".gitignore"))
          .map(async (file) => {
            const parentDir = file.webkitRelativePath.replace(
              /\/?[^/]*\.gitignore$/,
              "/",
            );
            const content = await file.text();
            const subIgnore = ignore().add(content);

            return {
              parentDir,
              subIgnore,
            };
          });
        const resolvedSubdirGitignores = await Promise.all(subdirGitignores);

        files.forEach((file) => {
          const fullPath = file.webkitRelativePath || file.name;

          const normalizedPath = fullPath.startsWith("/")
            ? fullPath.substring(1)
            : fullPath;

          const pathParts = normalizedPath.split("/");
          const pathRelativeToRoot = pathParts.slice(1).join("/");

          const checkPath = pathRelativeToRoot || normalizedPath;

          if (gitignore.ignores(checkPath)) {
            return;
          }

          const ignoreThis = resolvedSubdirGitignores.some(
            ({ parentDir, subIgnore }) => {
              if (fullPath.startsWith(parentDir)) {
                const relativeToSub = fullPath.substring(parentDir.length);
                return subIgnore.ignores(relativeToSub);
              }
              return false;
            },
          );

          if (ignoreThis) return;

          const fileName = pathParts.at(-1)?.toLowerCase();
          const isOveriewMD =
            !!fileName && overviewMdMatches.includes(fileName);

          if (isOveriewMD && onOverviewMDDetected && !overviewFound) {
            overviewFound = true;

            file.text()?.then((content) => {
              onOverviewMDDetected(content);
            });
          }

          zip.file(fullPath, file);
        });

        const starterFolder = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 6,
          },
        });

        setStarterFolder(starterFolder);
        setFolderName(folderName);

        if (onFolderUpload) {
          setStatus("uploading");
          setError(null);

          try {
            await onFolderUpload(
              {
                blob: starterFolder,
                name: folderName || "starter_files.zip",
              },
              {
                onProgress: (progress) => setUploadProgress(progress),
                onSuccess: () => {
                  setStatus("success");
                  setUploadProgress(100);
                },
                onError: (error) => {
                  setStatus("error");
                  setError(error.message);
                },
              },
            );
          } catch (error) {
            setStatus("error");
            setError(
              error instanceof Error
                ? error.message
                : "Failed to upload starter folder.",
            );
          }
        }
      }}
      className="w-full max-w-full"
      multiple
      webkitdirectory
      directory
    >
      <FileUploadDropzone className="w-full">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop folder here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max 1 root folder)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse folders
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <div>
        {starterFolder && (
          <Card className="w-full p-0">
            <CardContent className="flex justify-between py-2 pl-4 pr-2">
              <div className="flex items-center gap-2 w-full">
                <Folder size={20} />
                {folderName} ({(starterFolder.size / (1024 * 1024)).toFixed(2)}{" "}
                MB)
                <Progress value={uploadProgress} className="max-w-32 ml-4" />
                <span className="text-muted-foreground text-xs">
                  {status === "uploading" && "Uploading..."}
                  {status === "success" && "Uploaded"}
                  {status === "error" && "Upload failed"}
                </span>
              </div>

              <div>
                <Button
                  variant="secondary"
                  size="icon"
                  type="button"
                  onClick={async () => {
                    try {
                      if (onFolderRemove) {
                        await onFolderRemove();
                      }
                      setStarterFolder(null);
                      setFolderName(null);
                      setUploadProgress(0);
                      setStatus("idle");
                      setError(null);
                    } catch (error) {
                      setStatus("error");
                      setError(
                        error instanceof Error
                          ? error.message
                          : "Failed to remove starter folder.",
                      );
                    }
                  }}
                >
                  <X className="size-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {error && <p className="mt-2 text-destructive text-sm">{error}</p>}
      </div>
    </FileUpload>
  );
}
