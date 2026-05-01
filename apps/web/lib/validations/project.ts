import { z } from "zod";

export const projectAccessSchema = z.enum(["private", "public", "link"]);
export const projectAvailabilitySchema = z.enum(["open", "custom"]);

export const projectSchema = z
	.object({
		name: z.string().min(1, "Project name is required"),
		description: z.string().optional(),
		environment_id: z.coerce.number().int().positive(),
		access: projectAccessSchema,
		availability: projectAvailabilitySchema,
		availability_opens: z.date().optional(),
		availability_closes: z.date().optional(),
		starter_folder_id: z.string(),
		overview: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.availability === "custom") {
				return !!data.availability_opens && !!data.availability_closes;
			}
			return true;
		},
		{
			message:
				"Availability times (opens/closes) are required when availability is set to 'custom'",
			path: ["availability_times"],
		},
	);

export type Project = z.infer<typeof projectSchema>;
export type ProjectInput = z.input<typeof projectSchema>;
