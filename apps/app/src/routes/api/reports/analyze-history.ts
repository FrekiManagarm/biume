import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { compareAnatomicalHistory } from "@/lib/mastra/tools/compareAnatomicalHistoryTool";

const requestSchema = z.object({
  petId: z.string(),
  anatomicalPartId: z.string(),
  currentIssue: z.object({
    type: z.enum(["dysfunction", "anatomicalSuspicion", "observation"]),
    severity: z.number().min(1).max(5),
    laterality: z.enum(["left", "right", "bilateral"]),
    notes: z.string().optional(),
  }),
});

export const Route = createFileRoute("/api/reports/analyze-history")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validatedData = requestSchema.parse(body);
          const result = await compareAnatomicalHistory(validatedData);

          return Response.json({ success: true, data: result });
        } catch (error) {
          console.error("Error analyzing anatomical history", error);

          if (error instanceof z.ZodError) {
            return Response.json(
              {
                success: false,
                error: "Données invalides",
                details: error.issues,
              },
              { status: 400 },
            );
          }

          return Response.json(
            { success: false, error: "Erreur lors de l'analyse" },
            { status: 500 },
          );
        }
      },
    },
  },
});
