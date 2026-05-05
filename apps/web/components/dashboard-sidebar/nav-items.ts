import {
  FolderKanban,
  type LucideIcon,
  Send,
  Store,
  TerminalSquare,
} from "lucide-react";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    title: "Project Marketplace",
    href: "/project-marketplace",
    icon: Store,
  },
  {
    title: "Project Definitions",
    href: "/project-definitions",
    icon: FolderKanban,
  },
  {
    title: "IDE Sessions",
    href: "/ide-sessions",
    icon: TerminalSquare,
  },
  {
    title: "Submissions",
    href: "/submissions",
    icon: Send,
  },
];
