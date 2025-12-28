import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { db } from "@/lib/utils/db";
import { pets } from "@/lib/schemas";
import { eq } from "drizzle-orm";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";

export const searchPetsTool = createTool({
  id: "search-pets",
  description:
    "Recherche des patients (animaux) par nom dans l'organisation actuelle. Utilisez cet outil pour trouver un patient avant de générer un résumé ou consulter son dossier.",
  inputSchema: z.object({
    query: z.string().describe("Nom du patient à rechercher"),
  }),
  outputSchema: z.object({
    pets: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        breed: z.string(),
        animal: z.object({
          id: z.string(),
          name: z.string(),
          code: z.string(),
        }),
        birthDate: z.string().nullable(),
        ownerName: z.string().nullable(),
      }),
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    try {
      const organization = await getCurrentOrganization();
      if (!organization) throw new Error("Organization not found");

      const result = await db.query.pets.findMany({
        where: (pets, { ilike, and }) =>
          and(
            eq(pets.organizationId, organization.id),
            ilike(pets.name, `%${context.query}%`),
          ),
        with: {
          owner: true,
          animal: {
            with: {
              pets: true,
            },
          },
        },
        limit: 10,
      });

      return {
        pets: result.map((pet) => ({
          id: pet.id,
          name: pet.name,
          breed: pet.breed,
          animal: {
            id: pet.animal?.id ?? "",
            name: pet.animal?.name ?? "",
            code: pet.animal?.code ?? "",
          },
          birthDate: pet.birthDate
            ? new Date(pet.birthDate).toLocaleDateString("fr-FR")
            : null,
          ownerName: pet.owner?.name ?? null,
        })),
        count: result.length,
      };
    } catch (error) {
      console.error("Erreur lors de la recherche de patients:", error);
      return {
        pets: [],
        count: 0,
      };
    }
  },
});
