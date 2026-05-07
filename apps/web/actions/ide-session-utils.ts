import path from "node:path";
import { env } from "@/lib/env";

export type IdeSessionUser = {
  id: string;
  name: string;
  username?: string | null;
};

export function toWorkspaceSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getWorkspaceUsername(user: IdeSessionUser) {
  return toWorkspaceSegment(user.username || user.name || user.id) || user.id;
}

export function getEfsProjectPath(input: {
  user: IdeSessionUser;
  projectId: string;
}) {
  return path.join(
    env.EFS_MOUNT_PATH,
    getWorkspaceUsername(input.user),
    input.projectId,
    "project",
  );
}
