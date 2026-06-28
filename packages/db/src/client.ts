import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { serverEnv } from "@biume/env/server";

const databaseUrl = serverEnv.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to create the Biume database client.");
}

const sql = neon(databaseUrl);

export const db = drizzle(sql);
