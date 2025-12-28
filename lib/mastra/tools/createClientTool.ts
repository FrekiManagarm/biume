import { createTool } from "@mastra/core/tools";
import z from "zod";
import { clients } from "@/lib/schemas";
import { db } from "@/lib/utils/db";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";
import { revalidatePath } from "next/cache";

export const createClientTool = createTool({
  id: "create-client",
  description:
    "Crée un nouveau client dans le système. Utilisez cet outil uniquement après avoir confirmé toutes les informations nécessaires avec l'utilisateur.",
  inputSchema: z.object({
    name: z.string().describe("Nom complet du client"),
    email: z.email().optional().describe("Email du client"),
    phone: z.string().optional().describe("Numéro de téléphone"),
    address: z.string().optional().describe("Adresse postale"),
    city: z.string().optional().describe("Ville"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    clientId: z.string().optional(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const organization = await getCurrentOrganization();
      if (!organization) throw new Error("Organization not found");

      const [newClient] = await db
        .insert(clients)
        .values({
          name: context.name,
          email: context.email,
          phone: context.phone,
          address: context.address,
          city: context.city,
          organizationId: organization.id,
          createdAt: new Date(),
        })
        .returning({ id: clients.id });

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/clients");

      return {
        success: true,
        clientId: newClient.id,
        message: `Client ${context.name} créé avec succès.`,
      };
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      return {
        success: false,
        message: "Erreur lors de la création du client.",
      };
    }
  },
});
