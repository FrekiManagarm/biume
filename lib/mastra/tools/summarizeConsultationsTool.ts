import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { db } from "@/lib/utils/db";
import { advancedReport } from "@/lib/schemas";
import { and, desc, eq, gte, lte } from "drizzle-orm";

export const summarizeConsultationsTool = createTool({
  id: "summarize-consultations",
  description:
    "Produit un résumé chiffré des consultations d'un patient (volumétries, dernières dates, répartition statuts, top motifs).",
  inputSchema: z.object({
    petId: z
      .string()
      .describe("ID du patient pour lequel résumer les consultations"),
    from: z
      .string()
      .datetime()
      .optional()
      .describe("Filtrer à partir de cette date ISO"),
    to: z
      .string()
      .datetime()
      .optional()
      .describe("Filtrer jusqu'à cette date ISO"),
    limit: z
      .number()
      .int()
      .positive()
      .max(200)
      .default(100)
      .describe("Nombre max de rapports à analyser"),
  }),
  outputSchema: z.object({
    totalReports: z.number(),
    byStatus: z.record(z.string(), z.number()),
    lastConsultationAt: z.string().nullable(),
    topConsultationReasons: z.array(
      z.object({ reason: z.string(), count: z.number() }),
    ),
    timelineByMonth: z.array(
      z.object({ month: z.string(), count: z.number() }),
    ),
    sample: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        createdAt: z.string().nullable(),
        status: z.string(),
      }),
    ),
    summaryText: z.string(),
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
        title: advancedReport.title,
        consultationReason: advancedReport.consultationReason,
        notes: advancedReport.notes,
        status: advancedReport.status,
        createdAt: advancedReport.createdAt,
      })
      .from(advancedReport)
      .where(and(...whereClauses))
      .orderBy(desc(advancedReport.createdAt))
      .limit(context.limit);

    const totalReports = rows.length;
    const byStatus: Record<string, number> = {};
    const reasonCounts: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    let lastConsultationAt: string | null = null;
    for (const r of rows) {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      const reason = (r.consultationReason || "Non spécifié").trim();
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      if (r.createdAt) {
        const d = new Date(r.createdAt);
        if (!lastConsultationAt) lastConsultationAt = d.toISOString();
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        byMonth[key] = (byMonth[key] || 0) + 1;
      }
    }

    const topConsultationReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({ reason, count }));

    const timelineByMonth = Object.entries(byMonth)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([month, count]) => ({ month, count }));

    const sample = rows.slice(0, 10).map((r) => ({
      id: r.id,
      title: r.title,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
      status: r.status,
    }));

    const statusPart = Object.entries(byStatus)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    const topReasonPart = topConsultationReasons
      .map((t) => `${t.reason} (${t.count})`)
      .join(", ");

    const summaryText = `Total: ${totalReports}. Dernière consultation: ${lastConsultationAt ?? "n/a"}. Statuts: ${statusPart || "-"}. Motifs principaux: ${topReasonPart || "-"}.`;

    return {
      totalReports,
      byStatus,
      lastConsultationAt,
      topConsultationReasons,
      timelineByMonth,
      sample,
      summaryText,
    };
  },
});
