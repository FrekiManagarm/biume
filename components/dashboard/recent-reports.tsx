import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/style";
import { getRecentReports } from "@/lib/api/actions/dashboard.action";

type ReportItem = {
  id: string;
  title: string;
  type: "simple" | "advanced";
  patientName: string;
  consultationReason?: string;
  createdAt: string;
};

export async function RecentReports({ limit = 5 }: { limit?: number }) {
  const reportsData = await getRecentReports(limit);
  const reports: ReportItem[] = reportsData.map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    patientName: r.patientName,
    consultationReason: r.consultationReason ?? undefined,
    createdAt: r.createdAt,
  }));

  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Derniers rapports</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Consultations et comptes rendus récents
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="group">
            <Link href="/dashboard/reports" className="flex items-center gap-1">
              Voir tout
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <div className="rounded-full bg-muted p-3">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">Aucun rapport récent</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Vos rapports apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report, index) => (
              <ReportCard key={index} report={report} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReportCard({ report }: { report: ReportItem }) {
  const reportTypeLabel = report.type === "simple" ? "Simple" : "Avancé";
  const reportTypeVariant = report.type === "simple" ? "secondary" : "default";
  const formattedDate = format(new Date(report.createdAt), "d MMM yyyy", {
    locale: fr,
  });

  return (
    <Link
      href={`/dashboard/reports/${report.id}`}
      className={cn(
        "group relative block rounded-lg border bg-card p-4 transition-all",
        "hover:border-primary/50 hover:shadow-sm hover:bg-accent/5",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icône et contenu principal */}
        <div className="flex flex-1 gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              "bg-primary/10 text-primary transition-colors group-hover:bg-primary/15",
            )}
          >
            <FileText className="size-5" />
          </div>

          <div className="flex-1 space-y-2">
            {/* Titre */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                {report.title}
              </h3>
              <Badge
                variant={reportTypeVariant}
                className="shrink-0 text-xs font-medium"
              >
                {reportTypeLabel}
              </Badge>
            </div>

            {/* Raison de consultation */}
            {report.consultationReason && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {report.consultationReason}
              </p>
            )}

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="size-3.5" />
                <span>{report.patientName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flèche de navigation */}
        <div className="flex items-center">
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}

export function RecentReportsLoading() {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Derniers rapports</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Consultations et comptes rendus récents
            </p>
          </div>
          <Button variant="ghost" size="sm" disabled>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 gap-3">
                  <Skeleton className="size-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-4">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
                <Skeleton className="size-4" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
