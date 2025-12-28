import { createTool } from "@mastra/core/tools";
import z from "zod";
import {
  updateAppointment,
  checkAppointmentConflicts,
  getAppointments,
} from "@/lib/api/actions/appointments.action";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const updateAppointmentTool = createTool({
  id: "update-appointment-tool",
  description:
    "Modifie un rendez-vous existant (date, heure, patient, statut, note, etc.). Vérifie automatiquement les chevauchements avec les autres rendez-vous si les dates sont modifiées.",
  inputSchema: z.object({
    appointmentId: z.string().describe("ID du rendez-vous à modifier"),
    patientId: z.string().optional().describe("Nouveau patient (optionnel)"),
    beginAt: z
      .string()
      .optional()
      .describe("Nouvelle date/heure de début (format ISO)"),
    endAt: z
      .string()
      .optional()
      .describe("Nouvelle date/heure de fin (format ISO)"),
    atHome: z
      .boolean()
      .optional()
      .describe("Le rendez-vous est-il à domicile ?"),
    note: z.string().optional().describe("Nouvelle note"),
    status: z
      .enum(["CREATED", "CONFIRMED", "CANCELLED", "COMPLETED"])
      .optional()
      .describe("Nouveau statut du rendez-vous"),
    forceUpdate: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "Forcer la mise à jour même en cas de chevauchement (après confirmation utilisateur)",
      ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
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
  execute: async ({ context }) => {
    try {
      // Si les dates changent, vérifier les chevauchements
      if (
        (context.beginAt || context.endAt) &&
        context.beginAt &&
        context.endAt
      ) {
        const beginAt = parseISO(context.beginAt);
        const endAt = parseISO(context.endAt);

        // Vérifier les chevauchements en excluant le rendez-vous actuel
        const conflicts = await checkAppointmentConflicts(
          beginAt,
          endAt,
          context.appointmentId,
        );

        if (conflicts.length > 0 && !context.forceUpdate) {
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

Le nouveau créneau ${format(beginAt, "EEEE d MMMM 'à' HH:mm", { locale: fr })} - ${format(endAt, "HH:mm", { locale: fr })} chevauche ${conflicts.length} rendez-vous existant${conflicts.length > 1 ? "s" : ""} :

${conflictDetails}

Souhaitez-vous modifier ce rendez-vous malgré le chevauchement ?`,
          };
        }
      }

      // Pas de conflit ou modification forcée : mettre à jour le rendez-vous
      const updateData: {
        patientId?: string;
        beginAt?: Date;
        endAt?: Date;
        atHome?: boolean;
        note?: string;
        status?: "CREATED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
      } = {};

      if (context.patientId) updateData.patientId = context.patientId;
      if (context.beginAt) updateData.beginAt = parseISO(context.beginAt);
      if (context.endAt) updateData.endAt = parseISO(context.endAt);
      if (context.atHome !== undefined) updateData.atHome = context.atHome;
      if (context.note !== undefined) updateData.note = context.note;
      if (context.status) updateData.status = context.status;

      await updateAppointment(context.appointmentId, updateData);

      // Construire le message de succès
      let message = "✅ Rendez-vous modifié avec succès !\n\n";
      
      const changes: string[] = [];
      if (context.beginAt && context.endAt) {
        const beginAt = parseISO(context.beginAt);
        const endAt = parseISO(context.endAt);
        const dateStr = format(beginAt, "EEEE d MMMM 'à' HH:mm", { locale: fr });
        const duration = formatDuration(beginAt, endAt);
        changes.push(`📅 Nouveau créneau : ${dateStr} (${duration})`);
      }
      if (context.status) {
        const statusLabels = {
          CREATED: "Créé",
          CONFIRMED: "Confirmé",
          CANCELLED: "Annulé",
          COMPLETED: "Terminé",
        };
        changes.push(`📊 Statut : ${statusLabels[context.status]}`);
      }
      if (context.atHome !== undefined) {
        changes.push(`🏠 À domicile : ${context.atHome ? "Oui" : "Non"}`);
      }
      if (context.note) {
        changes.push(`📝 Note mise à jour`);
      }

      if (changes.length > 0) {
        message += changes.join("\n");
      }

      if (context.forceUpdate) {
        message += "\n\n⚠️ Modifié malgré le chevauchement détecté";
      }

      return {
        success: true,
        hasConflicts: false,
        message,
      };
    } catch (error) {
      console.error("Erreur lors de la modification du rendez-vous:", error);
      return {
        success: false,
        hasConflicts: false,
        message:
          "❌ Erreur lors de la modification du rendez-vous. Veuillez vérifier que le rendez-vous existe et réessayer.",
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

