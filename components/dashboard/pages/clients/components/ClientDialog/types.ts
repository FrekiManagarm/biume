import { CreatePetSchema } from "@/lib/schemas";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Le numéro de téléphone doit contenir au moins 10 chiffres.",
  }),
  city: z.string().min(2, {
    message: "La ville doit contenir au moins 2 caractères.",
  }),
  country: z.string().min(2, {
    message: "Le pays doit contenir au moins 2 caractères.",
  }),
  pets: z.array(CreatePetSchema).default([]),
});

export type FormValues = z.infer<typeof formSchema>;

export interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
