DROP INDEX "search_vector_index";--> statement-breakpoint
DROP INDEX "name_trgm_index";--> statement-breakpoint
CREATE INDEX "search_index" ON "projects" USING gin ((
          setweight(to_tsvector('english', "name"), 'A') ||
          setweight(to_tsvector('english', "description"), 'B')
      ));--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "search_vector";