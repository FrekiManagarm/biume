import { z } from "zod";

export const proBasicInformationsSchema = z.object({
  name: z.string({ error: "Nom requis" }).min(1, { message: "Nom requis" }),
  email: z.email({ error: "Email requis" }),
  description: z.string({ error: "Description requise" }).optional(),
  logo: z.url({ error: "Logo requis" }),
});
