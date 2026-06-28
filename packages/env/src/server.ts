import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().optional(),
  UPLOADTHING_TOKEN: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  AUTUMN_SECRET_KEY: z.string().optional(),
  TRIGGER_DEV_PROJECT_ID: z.string().optional(),
  TRIGGER_DEV_API_KEY: z.string().optional(),
  BIUME_AI_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export const serverEnv = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  AUTUMN_SECRET_KEY: process.env.AUTUMN_SECRET_KEY,
  TRIGGER_DEV_PROJECT_ID: process.env.TRIGGER_DEV_PROJECT_ID,
  TRIGGER_DEV_API_KEY: process.env.TRIGGER_DEV_API_KEY,
  BIUME_AI_URL: process.env.BIUME_AI_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
