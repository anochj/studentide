"use client";

import { Code2, MoreHorizontal, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectDefinition } from "@/actions";

type ProjectCardProps = {
	id: string;
	href?: string;
	name: string;
	description: string;
	visibility: "public" | "private" | "link";
	environment_name: string;
	creation_date?: string;
	icon?: string;
};

export function ProjectCard({
	id,
	href,
	name,
	description,
	visibility,
	environment_name,
	creation_date,
	icon,
}: ProjectCardProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: async () => {
			return await deleteProjectDefinition({ id });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["project-definitions"] });
		},
	});

	return (
		<Card className="group relative flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-md cursor-pointer h-full border">
			{href && (
				<Link
					href={href}
					aria-label={`Open ${name}`}
					className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				/>
			)}

			<CardHeader className="pointer-events-none relative z-20 flex flex-row items-start justify-between space-y-0 pb-2">
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
							className="pointer-events-auto -mr-2 -mt-2 h-8 w-8"
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
						{/* TODO: Implement this later, feeling lazy */}
						{/* <Button variant="ghost" size="lg" className="w-full justify-start">
							<Pencil />
							Edit Project
						</Button> */}

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="destructive"
									size="lg"
									className="w-full justify-start"
								>
									<Trash />
									Delete Project
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										the project from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel className="cursor-pointer">
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction asChild>
										<Button
											variant="destructive"
											className="bg-destructive hover:text-destructive hover:border-destructive hover:border cursor:pointer"
											onClick={() => {
												deleteMutation.mutate();
											}}
										>
											Delete
										</Button>
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</PopoverContent>
				</Popover>
			</CardHeader>

			<CardContent className="pointer-events-none relative z-20">
				<p className="line-clamp-2 text-sm text-muted-foreground">
					{description}
				</p>
			</CardContent>

			<CardFooter className="pointer-events-none relative z-20 flex items-center justify-between border-t p-4 mt-auto">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<span className="font-medium">{environment_name}</span>
					<span>•</span>
					{creation_date && (
						<span>{new Date(creation_date).toLocaleDateString()}</span>
					)}
				</div>

				<Button variant="outline" size="sm" asChild>
					<Link
						href={`/project-definitions/submissions/${id}`}
						className="pointer-events-auto"
					>
						View Submissions
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
