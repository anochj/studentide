"use client";

import { useState } from "react";
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Code2, Rocket, Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
	id: string;
	name: string;
	description: string;
	visibility: "public" | "private" | "link";
	environment_name: string;
	creation_date?: string;
	icon?: string;
};

export function ProjectCard({
	id,
	name,
	description,
	visibility,
	environment_name,
	creation_date,
	icon,
}: ProjectCardProps) {
	const [open, setOpen] = useState(false);

	return (
		<Card className="group flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-md cursor-pointer h-full">
			<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
				<div className="flex items-center gap-3">
					{icon ? (
						<Image
							src={icon}
							alt={`${name} icon`}
							width={35}
							height={35}
							objectFit="cover"
						/>
					) : (
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
							<Code2 className="h-5 w-5" />
						</div>
					)}

					<div className="flex items-center gap-2">
						<h3 className="font-semibold leading-none tracking-tight">
							{name}
						</h3>
						<Badge
							variant="outline"
							className="text-[10px] font-normal px-1.5 py-0 text-muted-foreground"
						>
							{visibility === "public"
								? "Public"
								: visibility === "private"
									? "Private"
									: "Shareable"}
						</Badge>
					</div>
				</div>

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="-mr-2 -mt-2 h-8 w-8"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setOpen((state) => !state);
							}}
						>
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">More options</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent align="center" className="w-min">
						<Button variant="ghost" size="lg" className="w-full justify-start">
							<Pencil />
							Edit Project
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="destructive"
									size="lg"
									className="w-full justify-start"
								>
									<Trash />
									Delete Project
								</Button>{" "}
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										your account from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction>Continue</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						{/* <PopoverHeader>
							<PopoverTitle>Title</PopoverTitle>
							<PopoverDescription>Description text here.</PopoverDescription>
						</PopoverHeader> */}
					</PopoverContent>
				</Popover>
			</CardHeader>

			<CardContent>
				<p className="line-clamp-2 text-sm text-muted-foreground">
					{description}
				</p>
			</CardContent>

			<CardFooter className="flex items-center justify-between border-t p-4 mt-auto">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<span className="font-medium">{environment_name}</span>
					<span>•</span>
					{creation_date && (
						<span>{new Date(creation_date).toLocaleDateString()}</span>
					)}
				</div>

				<Button variant="outline" size="sm" asChild>
					<Link href={`/project-definitions/submissions/${id}`}>
						View Submissions
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
