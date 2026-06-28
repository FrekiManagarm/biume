import { createTool } from "@mastra/core/tools";
import z from "zod";
import {
  createAppointment,
  checkAppointmentConflicts,
} from "@/lib/api/actions/appointments.action";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { revalidatePath } from "next/cache";

export const createAppointmentTool = createTool({
  id: "create-appointment-tool",
  description:
    "Crée un nouveau rendez-vous pour un patient. Vérifie automatiquement les chevauchements avec les rendez-vous existants et alerte l'utilisateur en cas de conflit avant de créer le rendez-vous.",
  inputSchema: z.object({
    patientId: z.string().describe("ID du patient pour le rendez-vous"),
    beginAt: z
      .string()
      .describe("Date et heure de début du rendez-vous (format ISO)"),
    endAt: z
      .string()
      .describe("Date et heure de fin du rendez-vous (format ISO)"),
    atHome: z
      .boolean()
      .optional()
      .default(false)
      .describe("Le rendez-vous est-il à domicile ?"),
    note: z.string().optional().describe("Note ou description du rendez-vous"),
    forceCreate: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "Forcer la création même en cas de chevauchement (après confirmation utilisateur)",
      ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    appointmentId: z.string().optional(),
    message: z.string(),
    conflicts: z
      .array(
        z.object({
          id: z.string(),
          patientName: z.string(),
          beginAt: z.string(),
          endAt: z.string(),
          status: z.string(),
        }),
      )
      .optional()
      .describe("Liste des rendez-vous en conflit, si détectés"),
    hasConflicts: z
      .boolean()
      .describe("Indique si des chevauchements ont été détectés"),
  }),
  execute: async (inputData) => {
    try {
      // Parser les dates et retirer une heure pour corriger le décalage
      const beginAtParsed = parseISO(inputData.beginAt);
      const endAtParsed = parseISO(inputData.endAt);
      const beginAt = new Date(beginAtParsed.getTime() - 60 * 60 * 1000); // Retirer 1 heure
      const endAt = new Date(endAtParsed.getTime() - 60 * 60 * 1000); // Retirer 1 heure

      // Vérifier les chevauchements avant de créer
      const conflicts = await checkAppointmentConflicts(beginAt, endAt);

      if (conflicts.length > 0 && !inputData.forceCreate) {
        // Il y a des chevauchements, informer l'utilisateur
        const conflictsList = conflicts.map((conflict) => ({
          id: conflict.id,
          patientName: conflict.patient?.name || "Patient non spécifié",
          beginAt: conflict.beginAt.toISOString(),
          endAt: conflict.endAt.toISOString(),
          status: conflict.status,
        }));

        const conflictDetails = conflicts
          .map((c) => {
            const time = format(c.beginAt, "EEEE d MMMM 'à' HH:mm", {
              locale: fr,
            });
            return `  • ${time} - ${c.patient?.name || "Patient non spécifié"} (${formatDuration(c.beginAt, c.endAt)})`;
          })
          .join("\n");

        return {
          success: false,
          hasConflicts: true,
          conflicts: conflictsList,
          message: `⚠️ **Attention : Chevauchement détecté !**

Le créneau ${format(beginAt, "EEEE d MMMM 'à' HH:mm", { locale: fr })} - ${format(endAt, "HH:mm", { locale: fr })} chevauche ${conflicts.length} rendez-vous existant${conflicts.length > 1 ? "s" : ""} :

${conflictDetails}

Souhaitez-vous créer ce rendez-vous malgré le chevauchement ?`,
        };
      }

      // Pas de conflit ou création forcée : créer le rendez-vous
      const newAppointment = await createAppointment({
        patientId: inputData.patientId,
        beginAt,
        endAt,
        atHome: inputData.atHome,
        note: inputData.note,
      });

      const dateStr = format(beginAt, "EEEE d MMMM 'à' HH:mm", { locale: fr });
      const duration = formatDuration(beginAt, endAt);

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/agenda");

      return {
        success: true,
        hasConflicts: false,
        appointmentId: newAppointment.id,
        message: inputData.forceCreate
          ? `✅ Rendez-vous créé malgré le chevauchement :\n📅 ${dateStr} (${duration})\n\nID : ${newAppointment.id}`
          : `✅ Rendez-vous créé avec succès !\n📅 ${dateStr} (${duration})\n\nID : ${newAppointment.id}`,
      };
    } catch (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      return {
        success: false,
        hasConflicts: false,
        message:
          "❌ Erreur lors de la création du rendez-vous. Veuillez vérifier les informations et réessayer.",
      };
    }
  },
});

function formatDuration(start: Date, end: Date): string {
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes}min`;
  }
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h${minutes}`;
}
