import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Singleton for the postgres client (reuse across requests)
let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (db) return db;

  client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
  });

  db = drizzle(client, { schema });
  return db;
}

// Export schema for convenience
export * from "./schema";
