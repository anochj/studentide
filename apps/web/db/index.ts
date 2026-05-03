import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const globalForDb = globalThis as unknown as {
	conn: postgres.Sql | undefined;
};

export const sql = globalForDb.conn ?? postgres(connectionString);

if (process.env.NODE_ENV !== "production") {
	globalForDb.conn = sql;
}

export const db = drizzle({ client: sql, schema });
