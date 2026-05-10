export * from "./auth-schema";

import { type SQL, sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

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

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
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
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    overview: text("overview"),
    starter_folder_id: uuid("starter_folder_id").references(
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
    search_vector: tsvector("search_vector").generatedAlwaysAs(
      (): SQL => sql`
                setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
                setweight(to_tsvector('english', coalesce(description, '')), 'B')
            `,
    ),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("projects_user_id_idx").on(table.user_id),
    index("search_vector_index").using("gin", table.search_vector),
    index("name_trgm_index").using("gin", sql`${table.name} gin_trgm_ops`),
  ],
);

export const ideSessionStatus = pgEnum("ide_session_status", [
  "provisioning",
  "active",
  "terminated",
  "error",
]);

export const ideSessions = pgTable(
  "ide_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    project_id: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    session_secret: text("session_secret").notNull().unique(),
    memory: integer("memory").notNull(),
    cpu: integer("cpu").notNull(),
    identifier: text("identifier").notNull(),
    task_definition_arn: text("task_definition_arn").notNull(),
    task_arn: text("task_arn").unique(),
    status: ideSessionStatus("status").notNull().default("provisioning"),
    started_at: timestamp("started_at").defaultNow().notNull(),
    ended_at: timestamp("ended_at"),
  },
  (table) => [
    index("ide_sessions_user_id_idx").on(table.user_id),
    index("ide_sessions_project_id_idx").on(table.project_id),
  ],
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    project_id: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ide_session_id: uuid("ide_session_id").references(() => ideSessions.id, {
      onDelete: "set null",
    }),
    content_path: text("content_path").notNull(),
    submitted_at: timestamp("submitted_at").defaultNow().notNull(),
  },
  (table) => [
    index("submissions_user_id_idx").on(table.user_id),
    index("submissions_project_id_idx").on(table.project_id),
    index("submissions_ide_session_id_idx").on(table.ide_session_id),
  ],
);
