CREATE INDEX "ide_sessions_user_id_idx" ON "ide_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ide_sessions_project_id_idx" ON "ide_sessions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "projects_user_id_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "submissions_user_id_idx" ON "submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "submissions_project_id_idx" ON "submissions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "submissions_ide_session_id_idx" ON "submissions" USING btree ("ide_session_id");