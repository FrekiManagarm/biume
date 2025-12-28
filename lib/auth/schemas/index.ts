import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide",
  }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      })
      .max(128, {
        message: "Le mot de passe ne peut pas dépasser 128 caractères",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category:
    | "work"
    | "personal"
    | "other"
    | "education"
    | "hobbies"
    | "health"
    | "finance";
}

export interface DayEvents {
  [date: string]: Event[];
}
