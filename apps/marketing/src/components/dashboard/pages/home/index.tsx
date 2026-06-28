import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  PawPrint,
  Send,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import {
  CompactInfoCard,
  DashboardPageHeader,
  EmptyAction,
  ReportStatusBadge,
} from "@/components/dashboard/report-ui";
import { NewReportButton } from "@/components/dashboard/new-report-button";
import {
  getDashboardWorkbenchData,
  type WorkbenchAppointment,
  type WorkbenchPatient,
  type WorkbenchReport,
} from "@/lib/api/actions/dashboard.action";
import { Button } from "@/components/ui/button";

function formatDate(value: string, pattern = "d MMM yyyy") {
  return format(new Date(value), pattern, { locale: fr });
}

function ReportWorkbenchRow({ report }: { report: WorkbenchReport }) {
  return (
    <Link
      href={`/dashboard/reports/${report.id}`}
      className="group block rounded-[1.25rem] border bg-background p-4 transition-all hover:border-secondary/40 hover:bg-secondary/5 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium">{report.title}</p>
            <ReportStatusBadge status={report.status} compact />
          </div>
          <p className="text-xs text-muted-foreground">
            {report.patientName} · {report.ownerName}
          </p>
          {report.consultationReason ? (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {report.consultationReason}
            </p>
          ) : null}
        </div>
        <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-secondary" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-muted px-2.5 py-1">
          {report.anatomicalIssueCount} zone(s)
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1">
          {report.recommendationCount} recommandation(s)
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1">
          {formatDate(report.updatedAt ?? report.createdAt)}
        </span>
      </div>
    </Link>
  );
}

function AppointmentRow({
  appointment,
}: {
  appointment: WorkbenchAppointment;
}) {
  return (
    <div className="rounded-[1.25rem] border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">{appointment.patientName}</p>
          <p className="text-xs text-muted-foreground">
            {appointment.ownerName} · {appointment.animalName ?? "Animal"}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(appointment.beginAt, "eeee d MMM · HH:mm")}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link href="/dashboard/reports">
            Créer le CR
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function PatientRow({ patient }: { patient: WorkbenchPatient }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[1.25rem] border bg-background p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{patient.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {patient.ownerName} · {patient.animalName ?? "Animal"}
          {patient.breed ? ` · ${patient.breed}` : ""}
        </p>
        {patient.latestReport ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ReportStatusBadge status={patient.latestReport.status} compact />
            <span className="text-xs text-muted-foreground">
              {formatDate(patient.latestReport.createdAt)}
            </span>
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Aucun compte rendu enregistré
          </p>
        )}
      </div>
      <Button asChild variant="ghost" size="sm" className="rounded-full">
        <Link
          href={`/dashboard/patients?search=${encodeURIComponent(patient.name)}`}
        >
          Ouvrir
        </Link>
      </Button>
    </div>
  );
}

function ActionPromptRow({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[1.35rem] bg-muted/40 px-4 py-4 transition-all hover:bg-secondary/10"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm group-hover:text-secondary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="truncate text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-secondary" />
    </Link>
  );
}

const DashboardHome = async () => {
  const workbench = await getDashboardWorkbenchData();

  const scoreCards = [
    {
      label: "A compléter",
      value: workbench.totals.drafts,
      detail: "brouillons à reprendre",
    },
    {
      label: "Prêts à envoyer",
      value: workbench.totals.readyToSend,
      detail: "finalisés en attente",
    },
    {
      label: "Rendez-vous à transformer",
      value: workbench.totals.appointmentsWithoutReport,
      detail: "sans compte rendu",
    },
    {
      label: "Envoyés récemment",
      value: workbench.totals.sent,
      detail: "preuve partagée",
    },
  ];
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
              Comptes rendus à reprendre, finaliser ou créer après consultation
              pour garder une communication claire avec le propriétaire.
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
              <ActionPromptRow
                icon={<Clock3 className="size-5" />}
                title="Reprendre les brouillons"
                description={`${workbench.totals.drafts} compte rendu à compléter`}
                href="/dashboard/reports"
              />
              <ActionPromptRow
                icon={<Send className="size-5" />}
                title="Préparer les envois"
                description={`${workbench.totals.readyToSend} compte rendu prêt propriétaire`}
                href="/dashboard/reports"
              />
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

          <div className="mt-8 grid overflow-hidden rounded-[1.5rem] border md:grid-cols-4">
            {scoreCards.map((card, index) => {
              const icons = [CircleAlert, CheckCircle2, CalendarClock, Send];
              const Icon = icons[index] ?? FileText;
              return (
                <div
                  key={card.label}
                  className="border-b p-5 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      {card.label}
                    </p>
                    <div className="flex size-9 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold tabular-nums">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {card.detail}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-muted/25 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold">Flux compte rendu</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Le pipeline reste centré sur la clarté propriétaire.
                </p>
              </div>
              <ReportStatusBadge status="finalized" />
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {["Motif", "Anatomie", "PDF"].map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border bg-background px-4 py-3"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Etape {index + 1}
                  </p>
                  <p className="mt-1 font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-7 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <CompactInfoCard
            title="Comptes rendus à reprendre"
            description="Les séances qui ont encore besoin d'observations, d'anatomie ou de recommandations."
            icon={<FileText className="size-5" />}
          >
            {workbench.drafts.length > 0 ? (
              <div className="space-y-3">
                {workbench.drafts.map((report) => (
                  <ReportWorkbenchRow key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <EmptyAction
                title="Aucun brouillon en attente"
                description="Votre file de rédaction est propre. Créez un compte rendu dès la prochaine séance."
                actionLabel="Créer un compte rendu"
                href="/dashboard/reports"
              />
            )}
          </CompactInfoCard>

          <CompactInfoCard
            title="Séances à transformer"
            description="Rendez-vous récents ou à venir qui n'ont pas encore de compte rendu associé."
            icon={<CalendarClock className="size-5" />}
          >
            {workbench.appointmentsWithoutReport.length > 0 ? (
              <div className="space-y-3">
                {workbench.appointmentsWithoutReport.map((appointment) => (
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            ) : (
              <EmptyAction
                icon={<CalendarClock className="size-5" />}
                title="Aucune séance en attente"
                description="Les rendez-vous sans compte rendu apparaîtront ici pour ne pas perdre le fil après consultation."
                actionLabel="Voir l'agenda"
                href="/dashboard/agenda"
              />
            )}
          </CompactInfoCard>
        </div>

        <div className="space-y-4">
          <CompactInfoCard
            title="Prêts à envoyer"
            description="Comptes rendus finalisés à partager au propriétaire."
            icon={<Send className="size-5" />}
          >
            {workbench.readyToSend.length > 0 ? (
              <div className="space-y-3">
                {workbench.readyToSend.map((report) => (
                  <ReportWorkbenchRow key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <EmptyAction
                icon={<Send className="size-5" />}
                title="Rien à envoyer pour le moment"
                description="Quand un compte rendu est finalisé, il remonte ici avant l'envoi propriétaire."
              />
            )}
          </CompactInfoCard>

          <CompactInfoCard
            title="Patients suivis récemment"
            description="Retour rapide vers les dossiers qui portent l'historique anatomique."
            icon={<PawPrint className="size-5" />}
          >
            {workbench.recentPatients.length > 0 ? (
              <div className="space-y-3">
                {workbench.recentPatients.map((patient) => (
                  <PatientRow key={patient.id} patient={patient} />
                ))}
              </div>
            ) : (
              <EmptyAction
                icon={<PawPrint className="size-5" />}
                title="Aucun patient enregistré"
                description="Ajoutez un patient pour commencer à documenter son suivi anatomique."
                actionLabel="Ajouter un patient"
                href="/dashboard/patients?action=new"
              />
            )}
          </CompactInfoCard>

          <CompactInfoCard
            title="Derniers comptes rendus envoyés"
            description="La preuve visible du travail déjà partagé."
            icon={<Stethoscope className="size-5" />}
          >
            {workbench.sentReports.length > 0 ? (
              <div className="space-y-3">
                {workbench.sentReports.map((report) => (
                  <div key={report.id}>
                    <ReportWorkbenchRow report={report} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyAction
                title="Aucun envoi récent"
                description="Les comptes rendus envoyés apparaîtront ici comme historique de communication propriétaire."
              />
            )}
          </CompactInfoCard>
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;
