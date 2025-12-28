import { createTool } from "@mastra/core/tools";
import z from "zod";

export const vulgarisationTool = createTool({
  id: "vulgarisation-tool",
  description:
    "Outil pour récupérer le contexte d'un rapport médical si un reportId est fourni. Utilise ce contexte pour mieux vulgariser le texte technique.",
  inputSchema: z.object({
    technicalText: z
      .string()
      .describe("Texte technique vétérinaire à vulgariser"),
    reportId: z
      .string()
      .optional()
      .describe("ID du rapport pour récupérer le contexte additionnel"),
  }),
  outputSchema: z.object({
    context: z.string().optional(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      // Si un reportId est fourni, on pourrait récupérer le contexte du rapport
      // Pour l'instant, on retourne simplement une confirmation
      if (context.reportId) {
        return {
          context: `Contexte du rapport ${context.reportId} disponible`,
          message:
            "Le texte technique est prêt à être vulgarisé avec le contexte du rapport.",
        };
      }

      return {
        message: "Le texte technique est prêt à être vulgarisé.",
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du contexte de vulgarisation:",
        error,
      );
      return {
        message:
          "Erreur lors de la récupération du contexte, mais la vulgarisation peut continuer.",
      };
    }
  },
});







