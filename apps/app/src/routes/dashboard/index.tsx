import { createFileRoute } from "@tanstack/react-router";

import {
  DashboardPageHeader,
  EmptyAction,
  ReportStatusBadge,
} from "@/components/dashboard/report-ui";
import { NewReportButton } from "@/components/dashboard/new-report-button";
import { Button } from "@/components/ui/button";
import { getDashboardHomeData } from "#app/lib/product-data";
import { ArrowRight, CalendarClock, Clock3, FileText, Send } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

export const Route = createFileRoute("/dashboard/")({
  loader: async () => getDashboardHomeData(),
  component: DashboardHomeRoute,
});

function formatDate(value: string, pattern = "d MMM yyyy") {
  return format(new Date(value), pattern, { locale: fr });
}

function DashboardHomeRoute() {
  const workbench = Route.useLoaderData();
  const reportsToReview = [...workbench.drafts, ...workbench.readyToSend];
  const totalToProcess =
    workbench.totals.drafts +
    workbench.totals.readyToSend +
    workbench.totals.appointmentsWithoutReport;

  return (
    <section className="space-y-8">
      <DashboardPageHeader
        eyebrow="Poste de travail"
        title="Bonjour, votre poste de compte rendu"
        description="Reprenez les brouillons, préparez les envois propriétaires et gardez le suivi anatomique au centre de votre journée."
        action={<NewReportButton className="rounded-full" />}
      />

      <div className="grid gap-7 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-7">
          <div className="rounded-[2rem] bg-neutral-950 p-8 text-white shadow-xl shadow-foreground/10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">
              A produire
            </p>
            <p className="mt-4 text-6xl font-bold tracking-normal tabular-nums">
              {totalToProcess}
            </p>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/60">
              Comptes rendus à reprendre, finaliser ou créer après consultation.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm">
            <div className="border-b pb-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Prochaines actions
              </p>
              <h2 className="mt-2 text-lg font-bold">
                {totalToProcess > 0
                  ? `${totalToProcess} élément${totalToProcess > 1 ? "s" : ""} à traiter`
                  : "Tout est à jour"}
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              <Link
                href="/dashboard/reports"
                className="group flex items-center gap-4 rounded-[1.35rem] bg-muted/40 px-4 py-4 transition-all hover:bg-secondary/10"
              >
                <Clock3 className="size-5 text-muted-foreground group-hover:text-secondary" />
                <span className="flex-1 text-sm font-bold">
                  Reprendre les brouillons
                </span>
                <span className="text-sm text-muted-foreground">
                  {workbench.totals.drafts}
                </span>
              </Link>
              <Link
                href="/dashboard/reports"
                className="group flex items-center gap-4 rounded-[1.35rem] bg-muted/40 px-4 py-4 transition-all hover:bg-secondary/10"
              >
                <Send className="size-5 text-muted-foreground group-hover:text-secondary" />
                <span className="flex-1 text-sm font-bold">
                  Préparer les envois
                </span>
                <span className="text-sm text-muted-foreground">
                  {workbench.totals.readyToSend}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-card p-7 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Brief de suivi
              </p>
              <h2 className="mt-3 text-2xl font-bold">
                Ce qui demande votre attention
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/dashboard/reports">
                Voir tout
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-3">
            {reportsToReview.length > 0 ? (
              reportsToReview.map((report) => (
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="group block rounded-[1.25rem] border bg-background p-4 transition-all hover:border-secondary/40 hover:bg-secondary/5 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {report.title}
                        </p>
                        <ReportStatusBadge status={report.status} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {report.patientName} · {report.ownerName}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-secondary" />
                  </div>
                </Link>
              ))
            ) : (
              <EmptyAction
                icon={<FileText className="size-5" />}
                title="Aucun compte rendu à reprendre"
                description="Votre liste de travail est propre."
                actionLabel="Créer un compte rendu"
                href="/dashboard/reports"
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border/70 bg-card p-7 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Rendez-vous
              </p>
              <h2 className="mt-2 text-xl font-bold">A transformer en CR</h2>
            </div>
            <CalendarClock className="size-5 text-muted-foreground" />
          </div>
          <div className="mt-5 space-y-3">
            {workbench.appointmentsWithoutReport.length > 0 ? (
              workbench.appointmentsWithoutReport.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-[1.25rem] border bg-background p-4"
                >
                  <p className="text-sm font-medium">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.ownerName} ·{" "}
                    {formatDate(appointment.beginAt, "eeee d MMM · HH:mm")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun rendez-vous en attente.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-card p-7 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Patients suivis
          </p>
          <h2 className="mt-2 text-xl font-bold">Derniers dossiers actifs</h2>
          <div className="mt-5 space-y-3">
            {workbench.recentPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between gap-3 rounded-[1.25rem] border bg-background p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{patient.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {patient.ownerName} · {patient.animalName ?? "Animal"}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link
                    href={`/dashboard/patients?search=${encodeURIComponent(patient.name)}`}
                  >
                    Ouvrir
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
