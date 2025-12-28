import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { db } from "@/lib/utils/db";
import { advancedReport } from "@/lib/schemas";
import { and, desc, eq, gte, lte } from "drizzle-orm";

// Synthèse narrative courte basée sur motifs et notes
export const synthesizeConsultationsTool = createTool({
  id: "synthesize-consultations",
  description:
    "Produit une synthèse narrative courte des consultations d'un patient (tendances, points d'attention, recommandations récurrentes).",
  inputSchema: z.object({
    petId: z.string().describe("ID du patient pour lequel générer la synthèse"),
    from: z.date().optional(),
    to: z.date().optional(),
    limit: z.number().int().positive().max(200).default(100),
  }),
  outputSchema: z.object({
    synthesis: z.string(),
    keyPoints: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const whereClauses = [eq(advancedReport.patientId, context.petId)];
    if (context.from)
      whereClauses.push(gte(advancedReport.createdAt, new Date(context.from)));
    if (context.to)
      whereClauses.push(lte(advancedReport.createdAt, new Date(context.to)));

    const rows = await db
      .select({
        id: advancedReport.id,
        consultationReason: advancedReport.consultationReason,
        notes: advancedReport.notes,
        createdAt: advancedReport.createdAt,
      })
      .from(advancedReport)
      .where(and(...whereClauses))
      .orderBy(desc(advancedReport.createdAt))
      .limit(context.limit);

    const reasons: Record<string, number> = {};
    const keywordCounts: Record<string, number> = {};
    const stopwords = new Set([
      "le",
      "la",
      "les",
      "de",
      "des",
      "du",
      "un",
      "une",
      "et",
      "ou",
      "à",
      "aux",
      "au",
      "en",
      "dans",
      "pour",
      "par",
      "sur",
      "avec",
      "sans",
      "ce",
      "cet",
      "cette",
      "ces",
      "est",
      "sont",
      "il",
      "elle",
      "ils",
      "elles",
      "je",
      "nous",
      "vous",
      "ne",
      "pas",
      "plus",
      "moins",
      "d'",
      "l'",
    ]);

    const addKeywords = (text?: string | null) => {
      if (!text) return;
      const words = text
        .toLowerCase()
        .replace(/[^a-zàâçéèêëîïôûùüÿñæœ'\s-]/g, " ")
        .split(/[\s-]+/)
        .filter((w) => w && !stopwords.has(w) && w.length > 2);
      for (const w of words) keywordCounts[w] = (keywordCounts[w] || 0) + 1;
    };

    for (const r of rows) {
      const reason = (r.consultationReason || "").trim();
      if (reason) reasons[reason] = (reasons[reason] || 0) + 1;
      addKeywords(r.consultationReason);
      addKeywords(r.notes);
    }

    const topReasons = Object.entries(reasons)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([reason]) => reason);

    const topKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([k]) => k)
      .filter((k) => !topReasons.includes(k));

    const keyPoints: string[] = [];
    if (topReasons.length)
      keyPoints.push(`Motifs récurrents: ${topReasons.join(", ")}`);
    if (topKeywords.length)
      keyPoints.push(`Thèmes saillants: ${topKeywords.join(", ")}`);
    if (rows.length)
      keyPoints.push(
        `Période analysée: ${new Date(rows.at(-1)!.createdAt ?? new Date()).toLocaleDateString("fr-FR")} → ${new Date(rows[0].createdAt ?? new Date()).toLocaleDateString("fr-FR")}`,
      );

    const synthesis = keyPoints.join(". ");

    return { synthesis, keyPoints };
  },
});
