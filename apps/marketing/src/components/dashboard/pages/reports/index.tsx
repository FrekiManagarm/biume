"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AdvancedReport } from "@/lib/schemas/advancedReport/advancedReport";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Send } from "lucide-react";
import {
  EmptyAction,
  ReportStatusBadge,
  getDashboardReportStatusMeta,
} from "@/components/dashboard/report-ui";
import {
  ReportsHeader,
  ReportsStats,
  ReportsFilters,
  ReportsPagination,
  ReportsNoResults,
} from "./components";

interface AdvancedReportsTableProps {
  reports: AdvancedReport[];
  // Props de contrôle optionnels (NuQS / URL state)
  searchQuery?: string;
  statusFilter?: string;
  currentPage?: number;
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onPageChange?: (page: number) => void;
}

export function AdvancedReportsTable({
  reports,
  searchQuery: controlledSearchQuery,
  statusFilter: controlledStatusFilter,
  currentPage: controlledCurrentPage,
  onSearchChange,
  onStatusChange,
  onPageChange,
}: AdvancedReportsTableProps) {
  // États internes (fallback si non contrôlé)
  const [uncontrolledSearchQuery, setUncontrolledSearchQuery] = useState("");
  const [uncontrolledStatusFilter, setUncontrolledStatusFilter] =
    useState<string>("tous");
  const [uncontrolledCurrentPage, setUncontrolledCurrentPage] = useState(1);

  // Valeurs effectives
  const searchQuery = controlledSearchQuery ?? uncontrolledSearchQuery;
  const statusFilter = controlledStatusFilter ?? uncontrolledStatusFilter;
  const currentPage = controlledCurrentPage ?? uncontrolledCurrentPage;

  // Handlers effectifs
  const handleSearchChange = onSearchChange ?? setUncontrolledSearchQuery;
  const handleStatusChange = onStatusChange ?? setUncontrolledStatusFilter;
  const handlePageChange = onPageChange ?? setUncontrolledCurrentPage;
  const itemsPerPage = 10;

  // Calcul des statistiques
  const stats = useMemo(() => {
    const total = reports.length;
    const brouillons = reports.filter((r) => r.status === "draft").length;
    const finalises = reports.filter((r) => r.status === "finalized").length;

    // Rapports créés ce mois
    const ceMois = new Date();
    const rapportsCeMois = reports.filter(
      (r) =>
        r.createdAt &&
        r.createdAt.getMonth() === ceMois.getMonth() &&
        r.createdAt.getFullYear() === ceMois.getFullYear(),
    ).length;

    return {
      total,
      brouillons,
      finalises,
      rapportsCeMois,
    };
  }, [reports]);

  // Pagination
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = reports.slice(startIndex, endIndex);

  // Reset à la page 1 quand on filtre
  useEffect(() => {
    handlePageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  // Suffixe pluriel pour l'affichage (évite la duplication des ternaires)
  const pluralSuffix = reports.length > 1 ? "s" : "";
  const reportColumns = [
    {
      status: "draft" as const,
      reports: currentReports.filter((report) => report.status === "draft"),
    },
    {
      status: "finalized" as const,
      reports: currentReports.filter((report) => report.status === "finalized"),
    },
    {
      status: "sent" as const,
      reports: currentReports.filter((report) => report.status === "sent"),
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <ReportsHeader />

      {/* Cartes de statistiques */}
      <ReportsStats
        total={stats.total}
        brouillons={stats.brouillons}
        finalises={stats.finalises}
        rapportsCeMois={stats.rapportsCeMois}
      />

      {/* Contenu */}
      <Card className="rounded-[2rem] border-border/70 bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-5">
            {/* Filtres */}
            <ReportsFilters
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
            />

            {/* Statistiques */}
            <div className="text-sm font-medium text-muted-foreground">
              {reports.length} compte{pluralSuffix} rendu{pluralSuffix} trouvé
              {pluralSuffix}
            </div>

            {/* Pipeline ou Empty state si filtrage sans résultat */}
            {reports.length === 0 ? (
              <ReportsNoResults
                onResetFilters={() => {
                  handleSearchChange("");
                  handleStatusChange("tous");
                }}
              />
            ) : (
              <>
                <div className="grid gap-4 xl:grid-cols-3">
                  {reportColumns.map((column) => {
                    const meta = getDashboardReportStatusMeta(column.status);
                    return (
                      <div
                        key={column.status}
                        className="rounded-[1.5rem] border bg-muted/20 p-4"
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-base font-bold">
                              {meta.columnTitle}
                            </h2>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {meta.columnDescription}
                            </p>
                          </div>
                          <ReportStatusBadge status={column.status} compact />
                        </div>

                        {column.reports.length > 0 ? (
                          <div className="space-y-3">
                            {column.reports.map((report) => (
                              <ReportPipelineCard
                                key={report.id}
                                report={report}
                              />
                            ))}
                          </div>
                        ) : (
                          <EmptyAction
                            icon={<FileText className="size-5" />}
                            title="Aucun compte rendu"
                            description="Les comptes rendus de ce statut apparaîtront ici."
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <ReportsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportPipelineCard({ report }: { report: AdvancedReport }) {
  const patient = report.patient;
  const owner = patient?.owner;
  const anatomicalIssueCount = report.anatomicalIssues?.length ?? 0;
  const recommendationCount = report.recommendations?.length ?? 0;

  return (
    <div className="rounded-[1.25rem] border bg-card p-4 shadow-sm transition-all hover:border-secondary/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{report.title}</h3>
            <ReportStatusBadge status={report.status} compact />
          </div>
          <p className="text-xs text-muted-foreground">
            {patient?.name || "Patient non renseigné"} ·{" "}
            {owner?.name || "Propriétaire non renseigné"}
          </p>
          {report.consultationReason ? (
            <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
              {report.consultationReason}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="rounded-full bg-muted/60 px-3 py-1.5">
          {anatomicalIssueCount} zone(s)
        </div>
        <div className="rounded-full bg-muted/60 px-3 py-1.5">
          {recommendationCount} conseil(s)
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link href={`/dashboard/reports/${report.id}`}>
            Ouvrir
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        {report.status === "finalized" ? (
          <Button asChild size="sm" className="rounded-full">
            <Link href={`/dashboard/reports/${report.id}`}>
              <Send className="size-4" />
              Préparer l'envoi
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
