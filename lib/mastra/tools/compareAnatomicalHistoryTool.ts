import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { db } from "@/lib/utils/db";
import { advancedReport } from "@/lib/schemas";
import { anatomicalIssue } from "@/lib/schemas/advancedReport/anatomicalIssue";
import { anatomicalPart } from "@/lib/schemas/anatomicalPart";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";

type CompareAnatomicalHistoryInput = {
  petId: string;
  anatomicalPartId: string;
  currentIssue: {
    type: "dysfunction" | "anatomicalSuspicion" | "observation";
    severity: number;
    laterality: "left" | "right" | "bilateral";
    notes?: string;
  };
};

type CompareAnatomicalHistoryOutput = {
  hasHistory: boolean;
  totalOccurrences: number;
  averageSeverity: number;
  severityTrend: "improving" | "stable" | "worsening" | "new";
  recurrenceLevel: "none" | "low" | "medium" | "high";
  evolution: string;
  trends: string[];
  alerts: string[];
  similarPatterns: Array<{
    partName: string;
    partId: string;
    similarity: string;
  }>;
  summary: string;
  detailedAnalysis: string;
};

export async function compareAnatomicalHistory(
  input: CompareAnatomicalHistoryInput,
): Promise<CompareAnatomicalHistoryOutput> {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) {
      throw new Error("Organization not found");
    }

    // Récupérer l'historique pour cette partie anatomique
    const conditions = [
      eq(advancedReport.patientId, input.petId),
      eq(advancedReport.status, "finalized"),
      eq(advancedReport.createdBy, organization.id),
      eq(anatomicalIssue.anatomicalPartId, input.anatomicalPartId),
      eq(anatomicalIssue.type, input.currentIssue.type),
    ];

    const issues = await db
      .select({
        severity: anatomicalIssue.severity,
        laterality: anatomicalIssue.laterality,
        createdAt: anatomicalIssue.createdAt,
      })
      .from(anatomicalIssue)
      .innerJoin(
        advancedReport,
        eq(anatomicalIssue.advancedReportId, advancedReport.id),
      )
      .where(and(...conditions))
      .orderBy(desc(advancedReport.createdAt));

    const history = issues.map((issue) => ({
      severity: issue.severity,
      laterality: issue.laterality,
      createdAt: issue.createdAt,
    }));

    // Si pas d'historique
    if (history.length === 0) {
      return {
        hasHistory: false,
        totalOccurrences: 0,
        averageSeverity: 0,
        severityTrend: "new" as const,
        recurrenceLevel: "none" as const,
        evolution: "Première occurrence sur cette partie anatomique.",
        trends: [],
        alerts: [],
        similarPatterns: [],
        summary: "Aucun antécédent sur cette partie anatomique.",
        detailedAnalysis:
          "Il s'agit de la première fois que cette partie anatomique est mentionnée pour ce patient. Surveiller l'évolution lors des prochaines consultations.",
      };
    }

    // Calculer les statistiques
    const totalOccurrences = history.length;
    const severities = history.map((h) => h.severity);
    const averageSeverity =
      severities.reduce((sum, s) => sum + s, 0) / severities.length;

    // Analyser la tendance de sévérité
    const recentSeverities = history.slice(0, 3).map((h) => h.severity);
    const olderSeverities = history.slice(3, 6).map((h) => h.severity);

    let severityTrend: "improving" | "stable" | "worsening" | "new" = "stable";
    if (recentSeverities.length > 0 && olderSeverities.length > 0) {
      const recentAvg =
        recentSeverities.reduce((sum, s) => sum + s, 0) /
        recentSeverities.length;
      const olderAvg =
        olderSeverities.reduce((sum, s) => sum + s, 0) /
        olderSeverities.length;
      const diff = recentAvg - olderAvg;

      if (diff < -0.5) severityTrend = "improving";
      else if (diff > 0.5) severityTrend = "worsening";
      else severityTrend = "stable";
    } else if (recentSeverities.length > 0) {
      const recentAvg =
        recentSeverities.reduce((sum, s) => sum + s, 0) /
        recentSeverities.length;
      if (input.currentIssue.severity < recentAvg) severityTrend = "improving";
      else if (input.currentIssue.severity > recentAvg)
        severityTrend = "worsening";
    }

    // Comparer avec la sévérité actuelle
    const severityDiff = input.currentIssue.severity - averageSeverity;
    if (severityDiff > 0.5) severityTrend = "worsening";
    else if (severityDiff < -0.5) severityTrend = "improving";

    // Niveau de récurrence
    let recurrenceLevel: "none" | "low" | "medium" | "high" = "low";
    if (totalOccurrences >= 5) recurrenceLevel = "high";
    else if (totalOccurrences >= 3) recurrenceLevel = "medium";

    // Générer l'évolution
    const evolutionParts: string[] = [];
    if (totalOccurrences > 1) {
      evolutionParts.push(
        `${totalOccurrences} occurrences précédentes sur cette partie anatomique.`,
      );
    }
    if (severityTrend === "improving") {
      evolutionParts.push(
        "Tendance à l'amélioration observée (sévérité en baisse).",
      );
    } else if (severityTrend === "worsening") {
      evolutionParts.push(
        "Tendance à la dégradation observée (sévérité en hausse).",
      );
    } else if (severityTrend === "stable") {
      evolutionParts.push("Sévérité relativement stable.");
    }

    // Générer les tendances
    const trends: string[] = [];
    const lateralityCounts: Record<string, number> = {};
    history.forEach((h) => {
      lateralityCounts[h.laterality] =
        (lateralityCounts[h.laterality] || 0) + 1;
    });
    const dominantLaterality = Object.entries(lateralityCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];
    if (dominantLaterality) {
      trends.push(
        `Latéralité prédominante: ${dominantLaterality[0]} (${dominantLaterality[1]} occurrences)`,
      );
    }

    if (averageSeverity > 3) {
      trends.push("Sévérité moyenne élevée sur cette partie anatomique.");
    }

    // Générer les alertes
    const alerts: string[] = [];
    if (input.currentIssue.severity > averageSeverity + 0.5) {
      alerts.push(
        `Sévérité actuelle (${input.currentIssue.severity}) supérieure à la moyenne historique (${averageSeverity.toFixed(1)}).`,
      );
    }
    if (recurrenceLevel === "high") {
      alerts.push(
        `Récurrence élevée: ${totalOccurrences} occurrences précédentes. Partie anatomique problématique récurrente.`,
      );
    }
    if (severityTrend === "worsening") {
      alerts.push(
        "Tendance à la dégradation détectée. Surveiller de près.",
      );
    }

    // Récupérer l'analyse anatomique globale pour trouver des patterns similaires
    const allReports = await db
      .select({ id: advancedReport.id })
      .from(advancedReport)
      .where(
        and(
          eq(advancedReport.patientId, input.petId),
          eq(advancedReport.status, "finalized"),
          eq(advancedReport.createdBy, organization.id),
        ),
      )
      .orderBy(desc(advancedReport.createdAt))
      .limit(200);

    const reportIds = allReports.map((r) => r.id);

    let similarPatterns: Array<{
      partName: string;
      partId: string;
      similarity: string;
    }> = [];

    if (reportIds.length > 0) {
      const allIssues = await db
        .select({
          partId: anatomicalPart.id,
          partName: anatomicalPart.name,
          severity: anatomicalIssue.severity,
        })
        .from(anatomicalIssue)
        .innerJoin(
          anatomicalPart,
          eq(anatomicalPart.id, anatomicalIssue.anatomicalPartId),
        )
        .where(
          and(
            inArray(anatomicalIssue.advancedReportId, reportIds),
            eq(anatomicalIssue.type, input.currentIssue.type),
          ),
        );

      // Grouper par partie anatomique et calculer les moyennes
      const partsMap: Record<
        string,
        { name: string; severities: number[] }
      > = {};
      for (const issue of allIssues) {
        if (issue.partId && issue.partId !== input.anatomicalPartId) {
          if (!partsMap[issue.partId]) {
            partsMap[issue.partId] = {
              name: issue.partName || "Partie inconnue",
              severities: [],
            };
          }
          partsMap[issue.partId].severities.push(issue.severity);
        }
      }

      // Calculer les moyennes et filtrer
      similarPatterns = Object.entries(partsMap)
        .filter(
          ([partId, data]) =>
            data.severities.length >= 2 &&
            data.severities.length > 0,
        )
        .map(([partId, data]) => {
          const avg =
            data.severities.reduce((sum, s) => sum + s, 0) /
            data.severities.length;
          return {
            partId,
            partName: data.name,
            avgSeverity: avg,
            count: data.severities.length,
          };
        })
        .filter(
          (part) =>
            part.avgSeverity >= averageSeverity - 0.5 &&
            part.avgSeverity <= averageSeverity + 0.5,
        )
        .slice(0, 3)
        .map((part) => ({
          partName: part.partName,
          partId: part.partId,
          similarity: `Sévérité moyenne similaire (${part.avgSeverity.toFixed(1)}) avec ${part.count} occurrences`,
        }));
    }

    // Générer le résumé
    const summary = `Historique: ${totalOccurrences} occurrence(s). Sévérité moyenne: ${averageSeverity.toFixed(1)}. Tendance: ${severityTrend === "improving" ? "amélioration" : severityTrend === "worsening" ? "dégradation" : "stable"}.`;

    // Générer l'analyse détaillée
    const detailedParts: string[] = [];
    detailedParts.push(
      `Cette partie anatomique a été mentionnée ${totalOccurrences} fois dans l'historique du patient.`,
    );
    detailedParts.push(
      `La sévérité moyenne historique est de ${averageSeverity.toFixed(1)}/5, comparée à ${input.currentIssue.severity}/5 actuellement.`,
    );
    if (severityTrend === "improving") {
      detailedParts.push(
        "L'évolution montre une tendance à l'amélioration, ce qui est positif.",
      );
    } else if (severityTrend === "worsening") {
      detailedParts.push(
        "L'évolution montre une tendance à la dégradation, nécessitant une attention particulière.",
      );
    }
    if (recurrenceLevel === "high") {
      detailedParts.push(
        "Cette partie anatomique est récurrente dans les consultations, suggérant un problème chronique.",
      );
    }
    if (similarPatterns.length > 0) {
      detailedParts.push(
        `Patterns similaires observés sur: ${similarPatterns.map((p) => p.partName).join(", ")}.`,
      );
    }

    const detailedAnalysis = detailedParts.join(" ");

    return {
      hasHistory: true,
      totalOccurrences,
      averageSeverity: Math.round(averageSeverity * 10) / 10,
      severityTrend,
      recurrenceLevel,
      evolution: evolutionParts.join(" "),
      trends,
      alerts,
      similarPatterns,
      summary,
      detailedAnalysis,
    };
  } catch (error) {
    console.error("Error comparing anatomical history", error);
    return {
      hasHistory: false,
      totalOccurrences: 0,
      averageSeverity: 0,
      severityTrend: "new" as const,
      recurrenceLevel: "none" as const,
      evolution: "Erreur lors de l'analyse.",
      trends: [],
      alerts: ["Erreur lors de l'analyse de l'historique."],
      similarPatterns: [],
      summary: "Erreur lors de l'analyse.",
      detailedAnalysis: "Impossible d'analyser l'historique pour le moment.",
    };
  }
}

export const compareAnatomicalHistoryTool = createTool({
  id: "compare-anatomical-history",
  description:
    "Compare une observation ou dysfunction actuelle avec l'historique du patient sur la même partie anatomique. Analyse l'évolution, détecte les tendances et suggère des patterns similaires.",
  inputSchema: z.object({
    petId: z.string().describe("ID du patient"),
    anatomicalPartId: z.string().describe("ID de la partie anatomique"),
    currentIssue: z.object({
      type: z
        .enum(["dysfunction", "anatomicalSuspicion", "observation"])
        .describe("Type de l'issue actuelle"),
      severity: z.number().min(1).max(5).describe("Sévérité actuelle (1-5)"),
      laterality: z
        .enum(["left", "right", "bilateral"])
        .describe("Latéralité actuelle"),
      notes: z.string().optional().describe("Notes actuelles"),
    }),
  }),
  outputSchema: z.object({
    hasHistory: z.boolean(),
    totalOccurrences: z.number(),
    averageSeverity: z.number(),
    severityTrend: z.enum(["improving", "stable", "worsening", "new"]),
    recurrenceLevel: z.enum(["none", "low", "medium", "high"]),
    evolution: z.string(),
    trends: z.array(z.string()),
    alerts: z.array(z.string()),
    similarPatterns: z.array(
      z.object({
        partName: z.string(),
        partId: z.string(),
        similarity: z.string(),
      }),
    ),
    summary: z.string(),
    detailedAnalysis: z.string(),
  }),
  execute: async ({ context }) => {
    return compareAnatomicalHistory(context);
  },
});

