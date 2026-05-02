CREATE TYPE "public"."ide_session_status" AS ENUM('provisioning', 'active', 'terminated', 'error');--> statement-breakpoint
ALTER TABLE "ide_sessions" ADD COLUMN "status" "ide_session_status" DEFAULT 'provisioning' NOT NULL;--> statement-breakpoint
ALTER TABLE "ide_sessions" ADD COLUMN "ended_at" timestamp;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "extension_store_enabled" boolean DEFAULT true NOT NULL;