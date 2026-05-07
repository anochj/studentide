import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const sql = globalForDb.conn ?? postgres(env.DATABASE_URL);

if (!env.IS_PRODUCTION) {
  globalForDb.conn = sql;
}

export const db = drizzle({ client: sql, schema });
