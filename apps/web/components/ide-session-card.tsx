"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
	MoreHorizontal,
	Code2,
	Pencil,
	Trash,
	Play,
	Inbox,
	Clock,
	Calendar,
	Square,
	Braces,
	Check,
	RotateCw,
	TriangleAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ProjectCardProps = {
	name: string;
	icon: string;
	started_at: Date;
	ended_at: Date | null;
	status: "provisioning" | "active" | "terminated" | "error";
	ide_identifier: string;
	project_slug: string;
	submitted: boolean;
	due_date?: Date;
};

// Extracted to clean up the JSX
const statusConfig = {
	provisioning: {
		label: "Provisioning",
		className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
	},
	active: {
		label: "Active",
		className: "bg-green-100 text-green-800 hover:bg-green-100",
	},
	terminated: {
		label: "Terminated",
		className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
	},
	error: {
		label: "Error",
		className: "bg-red-100 text-red-800 hover:bg-red-100",
	},
};

export default function IDESessionCard({
	name,
	icon,
	started_at,
	ended_at,
	status,
	ide_identifier,
	project_slug,
	submitted,
	due_date,
}: ProjectCardProps) {
	const currentStatus = statusConfig[status] || statusConfig.error;

	return (
		<Card className="group flex h-full max-w-xs flex-col justify-between transition-all">
			<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
				<div className="flex items-center gap-3">
					{icon ? (
						<Image
							src={icon}
							alt={`${name} icon`}
							width={35}
							height={35}
							className="object-cover"
						/>
					) : (
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
							<Code2 className="h-5 w-5" />
						</div>
					)}

					<div className="flex flex-col items-start gap-1">
						<h3 className="font-semibold leading-none tracking-tight">
							{name}
						</h3>
						<Badge
							variant="default"
							className={`px-1.5 py-0 text-[10px] font-normal ${currentStatus.className}`}
						>
							{currentStatus.label}
						</Badge>
					</div>
				</div>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="-mr-2 -mt-2 h-8 w-8 cursor-pointer"
						>
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">More options</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent align="center" className="w-56 p-2">
						<Button variant="ghost" className="w-full justify-start" asChild>
							<Link href={`/project-definitions/${project_slug}`}>
								<Braces className="mr-2 h-4 w-4" />
								Project Definition
							</Link>
						</Button>

						{status === "active" && (
							<Button
								variant="destructive"
								className="mt-1 w-full justify-start"
								onClick={() => {
									console.log("Stopping session...");
								}}
							>
								<Square className="mr-2 h-4 w-4" />
								Stop Session
							</Button>
						)}
					</PopoverContent>
				</Popover>
			</CardHeader>

			<CardContent className="flex flex-col gap-3 pt-2">
				<p className="flex items-center gap-2 text-sm text-muted-foreground">
					{status === "terminated" && (
						<>
							<Clock size={16} />
							Session{" "}
							{status === "terminated"
								? "stopped"
								: "encountered an error"}{" "}
						</>
					)}

					{status !== "terminated" && (
						<>
							<Clock size={16} />
							Running for{" "}
							{Math.floor(
								(new Date().getTime() - started_at.getTime()) / 60000,
							)}{" "}
							minutes
						</>
					)}
				</p>
				{due_date && (
					<p className="flex items-center gap-2 text-sm text-muted-foreground">
						<Calendar size={16} />
						Due on {due_date.toLocaleDateString()}
					</p>
				)}
			</CardContent>

			<CardFooter className="mt-auto flex w-full items-center justify-between gap-2 border-t p-2">
				{/* Active Link State */}
				{status === "active" && (
					<Button
						variant="default"
						size="lg"
						className="grow gap-2 transition-colors"
						asChild
					>
						<Link href={`https://${ide_identifier}-ide.studentide.com`}>
							<Play className="h-4 w-4" />
							Open IDE
						</Link>
					</Button>
				)}

				{/* Disabled State (Provisioning) */}
				{status === "provisioning" && (
					<Button
						variant="default"
						size="lg"
						className="grow gap-2 transition-colors"
						disabled
					>
						<Play className="h-4 w-4" />
						Open IDE
					</Button>
				)}

				{status === "terminated" && (
					<Button
						variant="default"
						size="lg"
						className="grow gap-2 transition-colors"
					>
						<RotateCw className="h-4 w-4" />
						Restart Session
					</Button>
				)}

				{status === "error" && (
					<Button
						variant="destructive"
						size="lg"
						className="grow gap-2 transition-colors"
						disabled
					>
						<TriangleAlert className="h-4 w-4" />
						Session Error
					</Button>
				)}

				<Button
					variant="outline"
					size="lg"
					className="gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
					disabled={submitted}
				>
					{submitted ? (
						<Check className="h-4 w-4" />
					) : (
						<Inbox className="h-4 w-4" />
					)}
					{submitted ? "Submitted" : "Submit"}
				</Button>
			</CardFooter>
		</Card>
	);
}
