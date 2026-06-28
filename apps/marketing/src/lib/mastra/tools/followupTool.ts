import { createTool } from "@mastra/core/tools";
import z from "zod";
import { getPatientById } from "@/lib/api/actions/patients.action";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const followupTool = createTool({
  id: "followup-tool",
  description:
    "Récupère l'historique complet d'un patient (animal) incluant ses consultations, rapports et informations médicales pour générer un résumé de suivi.",
  inputSchema: z.object({
    petId: z.string().describe("ID du patient (animal) à analyser"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    patient: z
      .object({
        id: z.string(),
        name: z.string(),
        breed: z.string().optional(),
        species: z.string().optional(),
        birthDate: z.string().optional(),
        ownerName: z.string().optional(),
        allergies: z.array(z.string()).optional(),
        diseases: z.array(z.string()).optional(),
      })
      .optional(),
    reports: z.array(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        consultationReason: z.string().optional(),
        createdAt: z.string().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
      }),
    ),
    summary: z.string(),
    totalReports: z.number(),
  }),
  execute: async (inputData) => {
    try {
      const patient = await getPatientById(inputData.petId);

      if (!patient) {
        return {
          success: false,
          reports: [],
          summary: "Patient non trouvé.",
          totalReports: 0,
        };
      }

      // Préparer les données du patient
      const patientData = {
        id: patient.id,
        name: patient.name,
        breed: patient.breed || undefined,
        species: patient.animal?.name || undefined,
        birthDate: patient.birthDate?.toISOString() || undefined,
        ownerName: patient.owner?.name || undefined,
        allergies: patient.allergies || undefined,
        diseases: patient.deseases || undefined,
      };

      // Récupérer les rapports associés
      const reports = (patient.advancedReport || []).map((report) => ({
        id: report.id,
        title: report.title || undefined,
        consultationReason: report.consultationReason || undefined,
        createdAt: report.createdAt?.toISOString() || undefined,
        status: report.createdAt ? "finalized" : "draft",
        notes: report.notes || undefined,
      }));

      // Générer un résumé
      const summary = generateFollowupSummary(patientData, reports);

      return {
        success: true,
        patient: patientData,
        reports,
        summary,
        totalReports: reports.length,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du suivi patient:",
        error,
      );
      return {
        success: false,
        reports: [],
        summary:
          "Erreur lors de la récupération du suivi patient. Veuillez réessayer.",
        totalReports: 0,
      };
    }
  },
});

function generateFollowupSummary(
  patient: {
    name: string;
    breed?: string;
    species?: string;
    birthDate?: string;
    ownerName?: string;
    allergies?: string[];
    diseases?: string[];
  },
  reports: Array<{
    consultationReason?: string;
    createdAt?: string;
    status?: string;
  }>,
): string {
  let summary = `Dossier de ${patient.name}`;

  if (patient.breed && patient.species) {
    summary += ` (${patient.breed}, ${patient.species})`;
  }

  if (patient.ownerName) {
    summary += `\nPropriétaire : ${patient.ownerName}`;
  }

  summary += `\n\n📊 Historique : ${reports.length} consultation${reports.length > 1 ? "s" : ""} enregistrée${reports.length > 1 ? "s" : ""}`;

  if (reports.length > 0) {
    summary += "\n\nDernières consultations :";
    const recentReports = reports
      .filter((r) => r.createdAt)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3);

    recentReports.forEach((report) => {
      if (report.createdAt) {
        const date = format(new Date(report.createdAt), "d MMMM yyyy", {
          locale: fr,
        });
        const reason = report.consultationReason || "Consultation générale";
        summary += `\n• ${date} : ${reason}`;
      }
    });
  }

  if (patient.allergies && patient.allergies.length > 0) {
    summary += `\n\n⚠️ Allergies : ${patient.allergies.join(", ")}`;
  }

  if (patient.diseases && patient.diseases.length > 0) {
    summary += `\n\n🏥 Maladies : ${patient.diseases.join(", ")}`;
  }

  return summary;
}







