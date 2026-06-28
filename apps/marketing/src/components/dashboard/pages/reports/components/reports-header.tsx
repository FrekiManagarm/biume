import { NewReportButton } from "@/components/dashboard/new-report-button";
import { DashboardPageHeader } from "@/components/dashboard/report-ui";

interface ReportsHeaderProps {
  disabled?: boolean;
}

export function ReportsHeader({ disabled = false }: ReportsHeaderProps) {
  return (
    <DashboardPageHeader
      eyebrow="Compte rendu anatomique"
      title="Comptes rendus anatomiques"
      description="Pilotez les brouillons, les comptes rendus prêts à envoyer et l'historique partagé aux propriétaires."
      action={
        <NewReportButton
          label="Nouveau compte rendu"
          className={disabled ? "pointer-events-none opacity-50" : undefined}
        />
      }
    />
  );
}
