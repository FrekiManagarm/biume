import { AdvancedReportEditor } from "@/components/reports-module/reports-editor";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";
import { getReportById } from "@/lib/api/actions/reports.action";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const DashboardOrganizationReportsEdit = async ({ params }: Props) => {
  const { id: reportId } = await params;
  const org = await getCurrentOrganization();

  if (!org) {
    notFound();
  }

  // Récupération des données du rapport côté serveur
  const reportResult = await getReportById({ reportId });

  if (!reportResult.success || !reportResult.data) {
    notFound();
  }

  return (
    <AdvancedReportEditor
      reportId={reportId}
      orgId={org.id}
      initialData={reportResult.data}
    />
  );
};

export default DashboardOrganizationReportsEdit;
