import { z } from "zod";

const webEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

type PublicEnvSource = Partial<Record<keyof WebEnv, string | undefined>>;

const nodePublicEnv =
  typeof process === "undefined" ? undefined : (process.env as PublicEnvSource);

export function parseWebEnv(source: PublicEnvSource = nodePublicEnv ?? {}): WebEnv {
  return webEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: source.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_POSTHOG_KEY: source.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: source.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export const webEnv = parseWebEnv();
