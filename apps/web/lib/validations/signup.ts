import { z } from "zod";

export const usernameSchema = z
	.string()
	.min(1, "Username is required")
	.max(25, "Username must be at most 25 characters long")
	.refine(
		(val) => !/[^a-zA-Z0-9]/.test(val),
		"Username can only contain letters and numbers",
	);

export const signupSchema = z.object({
	username: usernameSchema,
	email: z.string().pipe(z.email("Invalid email address")),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type SignupInput = z.infer<typeof signupSchema>;
