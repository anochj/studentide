export * from "./auth-schema";

import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { task } from "better-auth/react";

export const environments = pgTable("environments", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	icon: text("icon").notNull(),
	task_definition_arn: text("task_definition_arn").notNull().unique(),
});

export const objectStatus = pgEnum("object_status", [
	"pending",
	"active",
	"deleted",
]);

export const starterFolders = pgTable("starter_folders", {
	id: uuid("id").defaultRandom().primaryKey(),
	user_id: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	size: integer("size").notNull(),
	path: text("path").notNull(),
	status: objectStatus("status").notNull().default("pending"),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
	deleted_at: timestamp("deleted_at"),
});

export const projectAccess = pgEnum("project_access", [
	"private",
	"public",
	"link",
]);
export const projectAvailability = pgEnum("project_availability", [
	"open",
	"custom",
]);

export const projects = pgTable("projects", {
	id: uuid("id").defaultRandom().primaryKey(),
	user_id: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	description: text("description"),
	overview: text("overview"),
	starter_folder_id: uuid("starter_folder_id").references(
		// Also fixed the column name here
		() => starterFolders.id,
		{
			onDelete: "set null",
		},
	),
	environment_id: integer("environment_id")
		.notNull()
		.references(() => environments.id),
	access: projectAccess("access").notNull().default("private"),
	availability: projectAvailability("availability").notNull().default("open"),
	availability_opens: timestamp("availability_opens"),
	availability_closes: timestamp("availability_closes"),

	extension_store_enabled: boolean("extension_store_enabled")
		.notNull()
		.default(true),

	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const ideSessionStatus = pgEnum("ide_session_status", [
	"provisioning",
	"active",
	"terminated",
	"error",
]);

export const ideSessions = pgTable("ide_sessions", {
	id: uuid("id").defaultRandom().primaryKey(),
	user_id: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	project_id: uuid("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	memory: integer("memory").notNull(),
	cpu: integer("cpu").notNull(),
	identifier: text("identifier").notNull(),
	task_definition_arn: text("task_definition_arn").notNull(),
    task_arn: text("task_arn").unique(),
	status: ideSessionStatus("status").notNull().default("provisioning"),
	started_at: timestamp("started_at").defaultNow().notNull(),
	ended_at: timestamp("ended_at"),
});
