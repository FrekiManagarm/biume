import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { db } from "@/lib/utils/db";
import { advancedReport } from "@/lib/schemas";
import { anatomicalIssue } from "@/lib/schemas/advancedReport/anatomicalIssue";
import { anatomicalPart } from "@/lib/schemas/anatomicalPart";
import { and, desc, eq, gte, lte, inArray } from "drizzle-orm";

export const analyzeAnatomyTool = createTool({
  id: "analyze-anatomy",
  description:
    "Analyse les observations anatomiques d'un patient (zones, types, latéralité, sévérité) en agrégeant par partie anatomique.",
  inputSchema: z.object({
    petId: z.string().describe("ID du patient"),
    from: z.date().optional(),
    to: z.date().optional(),
    limit: z.number().int().positive().max(500).default(200),
  }),
  outputSchema: z.object({
    totalIssues: z.number(),
    byType: z.record(z.string(), z.number()),
    byLaterality: z.record(z.string(), z.number()),
    severityDistribution: z.record(z.string(), z.number()),
    topParts: z.array(
      z.object({
        partName: z.string(),
        count: z.number(),
        zone: z.string().optional(),
      }),
    ),
    partsBreakdown: z.array(
      z.object({
        partId: z.string(),
        name: z.string(),
        zone: z.string().optional(),
        count: z.number(),
        types: z.record(z.string(), z.number()),
        avgSeverity: z.number(),
      }),
    ),
    summaryText: z.string(),
  }),
  execute: async ({ context }) => {
    // Récupérer les rapports du patient, bornés par dates si fourni
    const reportWhere = [eq(advancedReport.patientId, context.petId)];
    if (context.from)
      reportWhere.push(gte(advancedReport.createdAt, context.from));
    if (context.to) reportWhere.push(lte(advancedReport.createdAt, context.to));

    const reports = await db
      .select({ id: advancedReport.id, createdAt: advancedReport.createdAt })
      .from(advancedReport)
      .where(and(...reportWhere))
      .orderBy(desc(advancedReport.createdAt))
      .limit(context.limit);

    if (reports.length === 0) {
      return {
        totalIssues: 0,
        byType: {},
        byLaterality: {},
        severityDistribution: {},
        topParts: [],
        partsBreakdown: [],
        summaryText: "Aucune observation anatomique pour ce périmètre.",
      };
    }

    const reportIds = reports.map((r) => r.id);

    // Jointure issues + parts sur l'ensemble des rapports (IN)
    const records = await db
      .select({
        issueId: anatomicalIssue.id,
        type: anatomicalIssue.type,
        laterality: anatomicalIssue.laterality,
        severity: anatomicalIssue.severity,
        partId: anatomicalPart.id,
        partName: anatomicalPart.name,
        zone: anatomicalPart.zone,
      })
      .from(anatomicalIssue)
      .leftJoin(
        anatomicalPart,
        eq(anatomicalPart.id, anatomicalIssue.anatomicalPartId),
      )
      .where(inArray(anatomicalIssue.advancedReportId, reportIds))
      .orderBy(desc(anatomicalIssue.createdAt ?? anatomicalIssue.id));

    const recordsTyped = records as Array<{
      issueId: string;
      type: string;
      laterality: string;
      severity: number;
      partId: string | null;
      partName: string | null;
      zone: string | null;
    }>;

    const byType: Record<string, number> = {};
    const byLaterality: Record<string, number> = {};
    const severityDistribution: Record<string, number> = {};
    const partsMap: Record<
      string,
      {
        name: string;
        zone?: string;
        count: number;
        types: Record<string, number>;
        severitySum: number;
      }
    > = {};

    for (const r of recordsTyped) {
      byType[r.type] = (byType[r.type] || 0) + 1;
      byLaterality[r.laterality] = (byLaterality[r.laterality] || 0) + 1;
      severityDistribution[String(r.severity)] =
        (severityDistribution[String(r.severity)] || 0) + 1;

      const key = r.partId || "unknown";
      if (!partsMap[key]) {
        partsMap[key] = {
          name: r.partName || "Partie inconnue",
          zone: r.zone || undefined,
          count: 0,
          types: {},
          severitySum: 0,
        };
      }
      partsMap[key].count += 1;
      partsMap[key].types[r.type] = (partsMap[key].types[r.type] || 0) + 1;
      partsMap[key].severitySum += r.severity || 0;
    }

    const partsBreakdown = Object.entries(partsMap).map(([partId, data]) => ({
      partId,
      name: data.name,
      zone: data.zone,
      count: data.count,
      types: data.types,
      avgSeverity:
        data.count > 0
          ? Math.round((data.severitySum / data.count) * 10) / 10
          : 0,
    }));

    const topParts = partsBreakdown
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((p) => ({ partName: p.name, count: p.count, zone: p.zone }));

    const totalIssues = recordsTyped.length;
    const typeStr = Object.entries(byType)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    const latStr = Object.entries(byLaterality)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    const topPartStr = topParts
      .map((p) => `${p.partName} (${p.count})`)
      .join(", ");

    const summaryText = `Observations totales: ${totalIssues}. Types: ${typeStr || "-"}. Latéralité: ${latStr || "-"}. Zones les plus concernées: ${topPartStr || "-"}.`;

    return {
      totalIssues,
      byType,
      byLaterality,
      severityDistribution,
      topParts,
      partsBreakdown,
      summaryText,
    };
  },
});
