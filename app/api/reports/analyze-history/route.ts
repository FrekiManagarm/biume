import { NextRequest, NextResponse } from "next/server";
import { compareAnatomicalHistory } from "@/lib/mastra/tools/compareAnatomicalHistoryTool";
import { z } from "zod";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = requestSchema.parse(body);

    const result = await compareAnatomicalHistory(validatedData);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error analyzing anatomical history", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'analyse" },
      { status: 500 },
    );
  }
}

