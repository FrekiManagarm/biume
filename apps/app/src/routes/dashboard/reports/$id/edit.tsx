import { createFileRoute, notFound } from "@tanstack/react-router";

import { AdvancedReportEditor } from "@/components/reports-module/reports-editor";
import { getReportEditorData } from "#app/lib/product-data";

export const Route = createFileRoute("/dashboard/reports/$id/edit")({
  loader: async ({ params }) => {
    const result = await getReportEditorData({
      data: { reportId: params.id },
    });

    if (!result.organization || !result.report.success || !result.report.data) {
      throw notFound();
    }

    return {
      reportId: params.id,
      orgId: result.organization.id,
      report: result.report.data,
    };
  },
  component: ReportEditorRoute,
});

function ReportEditorRoute() {
  const { reportId, orgId, report } = Route.useLoaderData();

  return (
    <AdvancedReportEditor
      reportId={reportId}
      orgId={orgId}
      initialData={report}
    />
  );
}
