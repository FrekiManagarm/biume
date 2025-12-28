import { createTool } from "@mastra/core/tools";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/utils/db";
import { advancedReport } from "@/lib/schemas";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";

export const getPatientDetailsTool = createTool({
  id: "get-patient-details",
  description:
    "Récupère tous les détails d'un patient spécifique incluant ses informations personnelles, son historique médical, et tous ses rapports de consultation. Utilisez cet outil après avoir trouvé l'ID du patient avec search-pets.",
  inputSchema: z.object({
    petId: z.string().describe("ID du patient dont on veut les détails"),
  }),
  outputSchema: z.object({
    pet: z
      .object({
        id: z.string(),
        name: z.string(),
        breed: z.string(),
        type: z.string().nullable(),
        weight: z.number(),
        height: z.number(),
        birthDate: z.string().nullable(),
        gender: z.string(),
        description: z.string().nullable(),
        deseases: z.array(z.string()).nullable(),
        allergies: z.array(z.string()).nullable(),
        intolerences: z.array(z.string()).nullable(),
        ownerName: z.string().nullable(),
        ownerEmail: z.string().nullable(),
        ownerPhone: z.string().nullable(),
      })
      .nullable(),
    reports: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        consultationReason: z.string(),
        notes: z.string().nullable(),
        status: z.string(),
        createdAt: z.string().nullable(),
      }),
    ),
    reportCount: z.number(),
  }),
  execute: async ({ context }) => {
    try {
      const organization = await getCurrentOrganization();
      if (!organization) throw new Error("Organization not found");

      const petData = await db.query.pets.findFirst({
        where: (pets, { eq, and }) =>
          and(
            eq(pets.id, context.petId),
            eq(pets.organizationId, organization.id),
          ),
        with: {
          owner: true,
          animal: true,
        },
      });

      if (!petData) {
        return {
          pet: null,
          reports: [],
          reportCount: 0,
        };
      }

      // Récupérer les rapports du patient
      const reportsData = await db
        .select({
          id: advancedReport.id,
          title: advancedReport.title,
          consultationReason: advancedReport.consultationReason,
          notes: advancedReport.notes,
          status: advancedReport.status,
          createdAt: advancedReport.createdAt,
        })
        .from(advancedReport)
        .where(eq(advancedReport.patientId, context.petId))
        .orderBy(desc(advancedReport.createdAt))
        .limit(20);

      return {
        pet: {
          id: petData.id,
          name: petData.name,
          breed: petData.breed,
          type: petData.animal?.code ?? null,
          weight: petData.weight,
          height: petData.height,
          birthDate: petData.birthDate
            ? new Date(petData.birthDate as any).toISOString()
            : null,
          gender: (petData as any).gender ?? "",
          description: (petData as any).description ?? null,
          deseases: (petData as any).deseases ?? null,
          allergies: (petData as any).allergies ?? null,
          intolerences: (petData as any).intolerences ?? null,
          ownerName: petData.owner?.name ?? null,
          ownerEmail: (petData.owner as any)?.email ?? null,
          ownerPhone: (petData.owner as any)?.phone ?? null,
        },
        reports: reportsData.map((report) => ({
          id: report.id,
          title: report.title,
          consultationReason: report.consultationReason,
          notes: report.notes,
          status: report.status,
          createdAt: report.createdAt
            ? new Date(report.createdAt as any).toISOString()
            : null,
        })),
        reportCount: reportsData.length,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du patient:",
        error,
      );
      return {
        pet: null,
        reports: [],
        reportCount: 0,
      };
    }
  },
});
