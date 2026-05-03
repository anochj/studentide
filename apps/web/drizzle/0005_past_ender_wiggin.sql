ALTER TABLE "projects" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (
                setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
                setweight(to_tsvector('english', coalesce(description, '')), 'B')
            ) STORED;--> statement-breakpoint
CREATE INDEX "search_vector_index" ON "projects" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "name_trgm_index" ON "projects" USING gin ("name" gin_trgm_ops);