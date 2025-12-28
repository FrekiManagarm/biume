import { createTool } from "@mastra/core/tools";
import z from "zod";
import { getAppointmentsWithoutReport } from "@/lib/api/actions/appointments.action";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const getAppointmentsWithoutReportTool = createTool({
  id: "get-appointments-without-report",
  description:
    "Récupère la liste des rendez-vous complétés qui n'ont pas encore de rapport associé. Utilisez cet outil pour rappeler au professionnel les séances pour lesquelles il doit créer un rapport.",
  inputSchema: z.object({
    daysBack: z
      .number()
      .optional()
      .default(30)
      .describe(
        "Nombre de jours en arrière à vérifier (par défaut 30 jours)",
      ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    appointments: z.array(
      z.object({
        id: z.string(),
        patientName: z.string(),
        beginAt: z.string(),
        endAt: z.string(),
        note: z.string().optional(),
        atHome: z.boolean(),
      }),
    ),
    summary: z.string(),
    totalAppointments: z.number(),
  }),
  execute: async ({ context }) => {
    try {
      const appointments = await getAppointmentsWithoutReport(
        context.daysBack || 30,
      );

      // Transformer les données pour l'agent
      const appointmentsData = appointments.map((apt) => ({
        id: apt.id,
        patientName: apt.patient?.name || "Patient non spécifié",
        beginAt: apt.beginAt.toISOString(),
        endAt: apt.endAt.toISOString(),
        note: apt.note || undefined,
        atHome: apt.atHome,
      }));

      // Générer un résumé textuel
      let summary = "";
      if (appointmentsData.length === 0) {
        summary =
          "✅ Aucun rendez-vous complété sans rapport trouvé pour cette période.";
      } else {
        summary = `⚠️ ${appointmentsData.length} rendez-vous complété${appointmentsData.length > 1 ? "s" : ""} sans rapport :\n\n`;
        appointmentsData.forEach((apt, index) => {
          const date = format(parseISO(apt.beginAt), "EEEE d MMMM yyyy à HH:mm", {
            locale: fr,
          });
          summary += `${index + 1}. ${apt.patientName} - ${date}\n`;
          if (apt.note) {
            summary += `   Note: ${apt.note}\n`;
          }
        });
      }

      return {
        success: true,
        appointments: appointmentsData,
        summary,
        totalAppointments: appointmentsData.length,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des rendez-vous sans rapport:",
        error,
      );
      return {
        success: false,
        appointments: [],
        summary:
          "Erreur lors de la récupération des rendez-vous sans rapport. Veuillez réessayer.",
        totalAppointments: 0,
      };
    }
  },
});
