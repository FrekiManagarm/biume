import { pets } from "@/lib/schemas";
import { createTool } from "@mastra/core/tools";
import z from "zod";
import { db } from "@/lib/utils/db";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";
import { revalidatePath } from "next/cache";

export const createPetTool = createTool({
  id: "create-pet",
  description:
    "Crée un nouveau patient (animal) dans le système. Utilisez cet outil uniquement après avoir confirmé toutes les informations nécessaires avec l'utilisateur et vérifié que le propriétaire existe.",
  inputSchema: z.object({
    name: z.string().describe("Nom du patient"),
    breed: z.string().describe("Race"),
    type: z.string().describe("Type d'animal (ID de l'espèce)"),
    weight: z.number().describe("Poids en kg"),
    height: z.number().describe("Taille en cm"),
    birthDate: z.string().describe("Date de naissance (ISO format)"),
    gender: z.enum(["Male", "Female"]).describe("Sexe de l'animal"),
    ownerId: z.string().describe("ID du propriétaire (client)"),
    description: z.string().optional().describe("Description optionnelle"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    petId: z.string().optional(),
    message: z.string(),
  }),
  execute: async ({ context, runtimeContext }) => {
    try {
      const organization = await getCurrentOrganization();
      if (!organization) throw new Error("Organization not found");

      const [newPet] = await db
        .insert(pets)
        .values({
          name: context.name,
          breed: context.breed,
          type: context.type,
          weight: context.weight,
          height: context.height,
          birthDate: new Date(context.birthDate),
          gender: context.gender,
          ownerId: context.ownerId,
          organizationId: organization.id,
          description: context.description,
          createdAt: new Date(),
        })
        .returning({ id: pets.id });

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/pets");

      return {
        success: true,
        petId: newPet.id,
        message: `Patient ${context.name} créé avec succès.`,
      };
    } catch (error) {
      console.error("Erreur lors de la création du patient:", error);
      return {
        success: false,
        message: "Erreur lors de la création du patient.",
      };
    }
  },
});
