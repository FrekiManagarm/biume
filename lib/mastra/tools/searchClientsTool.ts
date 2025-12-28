import { createTool } from "@mastra/core/tools";
import z from "zod";
import { db } from "@/lib/utils/db";
import { clients } from "@/lib/schemas";
import { or, ilike } from "drizzle-orm";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";

export const searchClientsTool = createTool({
  id: "search-clients",
  description:
    "Recherche des clients par nom ou email dans l'organisation actuelle. Utilisez cet outil pour trouver un client avant de créer un patient ou pour obtenir des informations sur un propriétaire.",
  inputSchema: z.object({
    query: z.string().describe("Nom ou email du client à rechercher"),
  }),
  outputSchema: z.object({
    clients: z.array(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        phone: z.string().nullable(),
        address: z.string().nullable(),
        city: z.string().nullable(),
      }),
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    try {
      const organization = await getCurrentOrganization();
      if (!organization) throw new Error("Organization not found");

      const results = await db
        .select({
          id: clients.id,
          name: clients.name,
          email: clients.email,
          phone: clients.phone,
          address: clients.address,
          city: clients.city,
        })
        .from(clients)
        .where(
          or(
            ilike(clients.name, `%${context.query}%`),
            ilike(clients.email, `%${context.query}%`),
          ),
        )
        .limit(10);

      console.log(results, "results");

      return {
        clients: results,
        count: results.length,
      };
    } catch (error) {
      console.error("Erreur lors de la recherche de clients:", error);
      return {
        clients: [],
        count: 0,
      };
    }
  },
});
