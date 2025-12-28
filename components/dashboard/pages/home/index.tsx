import { MetricsGrid, MetricCard } from "@/components/dashboard/metrics";
import { RecentActivity } from "@/components/dashboard/activity-widgets";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TodayAppointments } from "@/components/dashboard/today-appointments";
import {
  RecentReports,
  RecentReportsLoading,
} from "@/components/dashboard/recent-reports";
import {
  Users,
  PawPrint,
  FileText,
  Pencil,
  FileText as FileTextIcon,
} from "lucide-react";
import {
  getNewClientsMetric,
  getNewPatientsMetric,
  getSentReportsMetric,
  getDraftReportsMetric,
  getRecentActivity,
  type RecentActivityItem,
} from "@/lib/api/actions/dashboard.action";
import { getTodayAppointments } from "@/lib/api/actions/appointments.action";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";
import { Suspense, type ReactNode } from "react";

function transformActivityItems(items: RecentActivityItem[]): Array<{
  id: string;
  type: "appointment" | "report" | "payment" | "new_patient";
  title: string;
  description: string;
  timestamp: string;
  icon: ReactNode;
  color: string;
}> {
  return items.map((item) => {
    const isReport = item.type === "report";
    return {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      timestamp: item.timestamp,
      icon: isReport ? (
        <FileTextIcon className="size-4" />
      ) : (
        <PawPrint className="size-4" />
      ),
      color: isReport
        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  });
}

const DashboardHome = async () => {
  const [
    newClients,
    newPatients,
    sentReports,
    draftReports,
    recentActivity,
    appointments,
    organization,
  ] = await Promise.all([
    getNewClientsMetric(90),
    getNewPatientsMetric(90),
    getSentReportsMetric(30),
    getDraftReportsMetric(30),
    getRecentActivity(3),
    getTodayAppointments(),
    getCurrentOrganization(),
  ]);

  const activityItems = transformActivityItems(recentActivity);

  const metrics = [
    {
      title: "Nouveaux clients",
      description: "sur les 90 derniers jours",
      value: newClients.value,
      delta: newClients.delta,
      icon: <Users className="size-5" />,
    },
    {
      title: "Nouveaux patients",
      description: "sur les 90 derniers jours",
      value: newPatients.value,
      delta: newPatients.delta,
      icon: <PawPrint className="size-5" />,
    },
    {
      title: "Rapports envoyés",
      description: "30 derniers jours",
      value: sentReports.value,
      delta: sentReports.delta,
      icon: <FileText className="size-5" />,
    },
    {
      title: "Rapports en brouillon",
      description: "en attente de finalisation",
      value: draftReports.value,
      delta: draftReports.delta,
      icon: <Pencil className="size-5" />,
    },
  ];

  return (
    <section className="space-y-6">
      <DashboardHeader />

      <MetricsGrid>
        {metrics.map((m, index) => (
          <MetricCard key={index} {...m} />
        ))}
      </MetricsGrid>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Colonne principale */}
        <div className="space-y-4 lg:col-span-3">
          {/* Rendez-vous du jour */}
          <TodayAppointments
            appointments={appointments}
            organizationId={organization.id}
          />
          {/* Activité récente */}
          <RecentActivity items={activityItems} />
        </div>

        {/* Colonne latérale */}
        <div className="space-y-4 lg:col-span-2">
          {/* Derniers rapports */}
          <Suspense fallback={<RecentReportsLoading />}>
            <RecentReports limit={3} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;
