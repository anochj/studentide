export * from "./auth-schema";

import {
	integer,
	serial,
	uuid,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const environments = pgTable("environments", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	icon: text("icon").notNull(),
	task_definition_arn: text("task_definition_arn").notNull().unique(),
});

export const projects = pgTable("projects", {
	id: uuid("id").primaryKey(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	description: text("description"),
	starter_file_url: text("starter_file_url"),
	overview: text("overview"),
	user_id: integer("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	environment_id: integer("environment_id")
		.notNull()
		.references(() => environments.id),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const ideSessions = pgTable("ide_sessions", {
	id: uuid("id").primaryKey(),
	user_id: integer("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	project_id: integer("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	memory: integer("memory").notNull(),
	cpu: integer("cpu").notNull(),
	identifier: text("identifier").notNull(),
	task_definition_arn: text("task_definition_arn").notNull(),
	// TODO: maybe or maybe not store end time
	// status: text("status").notNull().default("provisioning"),
	started_at: timestamp("started_at").defaultNow().notNull(),
	// ended_at: timestamp("ended_at"),
});
