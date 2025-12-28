import { createTool } from "@mastra/core/tools";
import z from "zod";
import { advancedReport } from "@/lib/schemas";
import { db } from "@/lib/utils/db";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";
import { revalidatePath } from "next/cache";

export const createReportTool = createTool({
  id: "create-report",
  description:
    "Crée un nouveau rapport de consultation pour un patient. Utilisez cet outil uniquement après avoir confirmé le patient et les détails de la consultation.",
  inputSchema: z.object({
    title: z.string().describe("Titre du rapport"),
    consultationReason: z.string().describe("Motif de consultation"),
    patientId: z.string().describe("ID du patient concerné"),
    notes: z.string().optional().describe("Notes additionnelles"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    reportId: z.string().optional(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const organization = await getCurrentOrganization();

      if (!organization) throw new Error("Organization not found");

      const [newReport] = await db
        .insert(advancedReport)
        .values({
          title: context.title,
          consultationReason: context.consultationReason,
          patientId: context.patientId,
          createdBy: organization.id,
          notes: context.notes || "",
          status: "draft",
          createdAt: new Date(),
        })
        .returning({ id: advancedReport.id });

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/reports");

      return {
        success: true,
        reportId: newReport.id,
        message: `Rapport "${context.title}" créé avec succès.`,
      };
    } catch (error) {
      console.error("Erreur lors de la création du rapport:", error);
      return {
        success: false,
        message: "Erreur lors de la création du rapport.",
      };
    }
  },
});
