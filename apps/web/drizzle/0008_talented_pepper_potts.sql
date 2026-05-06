ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ide_sessions" ADD COLUMN "session_secret" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ide_sessions" ADD CONSTRAINT "ide_sessions_session_secret_unique" UNIQUE("session_secret");