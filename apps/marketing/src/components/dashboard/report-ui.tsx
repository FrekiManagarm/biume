import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, Clock3, FileText, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/style";

export type DashboardReportStatus = "draft" | "finalized" | "sent";

const reportStatusMeta: Record<
  DashboardReportStatus,
  {
    label: string;
    shortLabel: string;
    tone: string;
    icon: typeof Clock3;
    columnTitle: string;
    columnDescription: string;
  }
> = {
  draft: {
    label: "A compléter",
    shortLabel: "Brouillon",
    tone: "border-amber-200 bg-amber-500/10 text-amber-800 dark:border-amber-900/60 dark:text-amber-300",
    icon: Clock3,
    columnTitle: "A compléter",
    columnDescription: "Comptes rendus à reprendre avant relecture.",
  },
  finalized: {
    label: "Prêt à envoyer",
    shortLabel: "Finalisé",
    tone: "border-blue-200 bg-blue-500/10 text-blue-800 dark:border-blue-900/60 dark:text-blue-300",
    icon: CheckCircle2,
    columnTitle: "Prêt à envoyer",
    columnDescription: "Comptes rendus relus, en attente d'envoi.",
  },
  sent: {
    label: "Envoyé",
    shortLabel: "Envoyé",
    tone: "border-emerald-200 bg-emerald-500/10 text-emerald-800 dark:border-emerald-900/60 dark:text-emerald-300",
    icon: Send,
    columnTitle: "Envoyé",
    columnDescription: "Historique des comptes rendus partagés.",
  },
};

export function getDashboardReportStatusMeta(status?: string | null) {
  if (status === "finalized" || status === "sent" || status === "draft") {
    return reportStatusMeta[status];
  }

  return reportStatusMeta.draft;
}

export function ReportStatusBadge({
  status,
  compact = false,
}: {
  status?: string | null;
  compact?: boolean;
}) {
  const meta = getDashboardReportStatusMeta(status);
  const Icon = meta.icon;

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 py-1 text-[11px] gap-1.5", meta.tone)}
    >
      <Icon className="size-3" />
      {compact ? meta.shortLabel : meta.label}
    </Badge>
  );
}

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 py-1 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl space-y-2">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl text-3xl font-bold tracking-normal text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EmptyAction({
  icon,
  title,
  description,
  actionLabel,
  href,
  onClick,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  href?: string;
  onClick?: () => void;
}) {
  const button =
    actionLabel && href ? (
      <Button asChild variant="outline" size="sm" className="rounded-full">
        <Link href={href}>
          {actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    ) : actionLabel && onClick ? (
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={onClick}
      >
        {actionLabel}
        <ArrowRight className="size-4" />
      </Button>
    ) : null;

  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-[1.5rem] border border-dashed bg-muted/20 px-5 py-9 text-center">
      <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
        {icon ?? <FileText className="size-5" />}
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        {description}
      </p>
      {button ? <div className="mt-4">{button}</div> : null}
    </div>
  );
}

export function CompactInfoCard({
  title,
  description,
  icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-[2rem] border-border/70 bg-card shadow-sm",
        className,
      )}
    >
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-normal">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {icon ? (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              {icon}
            </div>
          ) : null}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
