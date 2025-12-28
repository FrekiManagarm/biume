import ReportsPageClient from "@/components/dashboard/pages/reports/client";
import { getAllReports } from "@/lib/api/actions/reports.action";
import { reportsSearchCache } from "./search-params";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const DashboardOrganizationReportsPage = async ({ searchParams }: Props) => {
  const { search, status } = await reportsSearchCache.parse(searchParams);

  const reports = await getAllReports({ search, status });

  return <ReportsPageClient reports={reports} />;
};

export default DashboardOrganizationReportsPage;
