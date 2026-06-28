import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { serverEnv } from "@biume/env/server";

type DatabaseClient = ReturnType<typeof drizzle>;

let cachedDb: DatabaseClient | undefined;

export function getDb(): DatabaseClient {
  if (cachedDb) {
    return cachedDb;
  }

  const databaseUrl = serverEnv.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to create the Biume database client.");
  }

  cachedDb = drizzle(neon(databaseUrl));

  return cachedDb;
}

export const db = new Proxy({} as DatabaseClient, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});
