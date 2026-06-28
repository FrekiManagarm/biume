import { z } from "zod";

export const proBasicInformationsSchema = z.object({
  name: z
    .string({ error: "Nom requis" })
    .trim()
    .min(1, { message: "Nom requis" }),
  email: z.email({ error: "Email requis" }).trim(),
});
