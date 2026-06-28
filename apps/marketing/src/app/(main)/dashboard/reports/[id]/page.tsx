import ReportDetails from "@/components/reports-module/reports-details";
import { getReportById } from "@/lib/api/actions/reports.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ReportDetailsLoading from "./loading";

interface DashboardOrganizationReportsDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: DashboardOrganizationReportsDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getReportById({ reportId: id });

  if (!result.success || !result.data) {
    return {
      title: "Rapport introuvable | Biume",
    };
  }

  return {
    title: `${result.data.title} | Biume`,
    description: `Détails du rapport : ${result.data.title}`,
  };
}

const DashboardOrganizationReportsDetailsPage = async ({
  params,
}: DashboardOrganizationReportsDetailsPageProps) => {
  const { id } = await params;

  const result = await getReportById({ reportId: id });

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <Suspense fallback={<ReportDetailsLoading />}>
      <ReportDetails report={result.data} />
    </Suspense>
  );
};

export default DashboardOrganizationReportsDetailsPage;
