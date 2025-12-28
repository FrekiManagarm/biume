import { createTool } from "@mastra/core/tools";
import z from "zod";
import { getAppointments } from "@/lib/api/actions/appointments.action";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const getAppointmentsTool = createTool({
  id: "get-appointments-tool",
  description:
    "Récupère la liste des rendez-vous existants du professionnel pour analyser les créneaux disponibles et occupés. Utilisez cet outil pour proposer des créneaux de planning optimisés.",
  inputSchema: z.object({
    startDate: z
      .string()
      .optional()
      .describe(
        "Date de début de la période à analyser (format ISO). Si non fourni, commence aujourd'hui.",
      ),
    endDate: z
      .string()
      .optional()
      .describe(
        "Date de fin de la période à analyser (format ISO). Si non fourni, analyse 7 jours.",
      ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    appointments: z.array(
      z.object({
        id: z.string(),
        patientName: z.string().optional(),
        beginAt: z.string(),
        endAt: z.string(),
        status: z.string(),
        note: z.string().optional(),
        atHome: z.boolean(),
      }),
    ),
    summary: z.string(),
    totalAppointments: z.number(),
  }),
  execute: async ({ context }) => {
    try {
      const appointments = await getAppointments();

      // Filtrage par dates si fournies
      let filteredAppointments = appointments;

      if (context.startDate || context.endDate) {
        const startDate = context.startDate
          ? parseISO(context.startDate)
          : new Date();
        const endDate = context.endDate
          ? parseISO(context.endDate)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 jours par défaut

        filteredAppointments = appointments.filter((apt) => {
          const aptDate = new Date(apt.beginAt);
          return isAfter(aptDate, startDate) && isBefore(aptDate, endDate);
        });
      }

      // Transformer les données pour l'agent
      const appointmentsData = filteredAppointments.map((apt) => ({
        id: apt.id,
        patientName: apt.patient?.name || "Patient non spécifié",
        beginAt: apt.beginAt.toISOString(),
        endAt: apt.endAt.toISOString(),
        status: apt.status,
        note: apt.note || undefined,
        atHome: apt.atHome,
      }));

      // Générer un résumé textuel
      const summary = generateAppointmentsSummary(appointmentsData);

      return {
        success: true,
        appointments: appointmentsData,
        summary,
        totalAppointments: appointmentsData.length,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des rendez-vous:",
        error,
      );
      return {
        success: false,
        appointments: [],
        summary:
          "Erreur lors de la récupération des rendez-vous. Veuillez réessayer.",
        totalAppointments: 0,
      };
    }
  },
});

function generateAppointmentsSummary(
  appointments: Array<{
    patientName: string;
    beginAt: string;
    endAt: string;
    status: string;
  }>,
): string {
  if (appointments.length === 0) {
    return "Aucun rendez-vous trouvé pour cette période.";
  }

  // Grouper par jour
  const byDay = appointments.reduce(
    (acc, apt) => {
      const day = format(parseISO(apt.beginAt), "EEEE d MMMM", { locale: fr });
      if (!acc[day]) acc[day] = [];
      acc[day].push(apt);
      return acc;
    },
    {} as Record<string, typeof appointments>,
  );

  let summary = `${appointments.length} rendez-vous trouvé${appointments.length > 1 ? "s" : ""} :\n\n`;

  for (const [day, apts] of Object.entries(byDay)) {
    summary += `${day} :\n`;
    apts.forEach((apt) => {
      const time = format(parseISO(apt.beginAt), "HH:mm", { locale: fr });
      summary += `  • ${time} - ${apt.patientName} (${apt.status})\n`;
    });
    summary += "\n";
  }

  return summary.trim();
}







