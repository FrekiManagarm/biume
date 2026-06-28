import { createFileRoute, notFound } from "@tanstack/react-router";

import ReportDetails from "@/components/reports-module/reports-details";
import { getReportDetailsData } from "#app/lib/product-data";

export const Route = createFileRoute("/dashboard/reports/$id")({
  loader: async ({ params }) => {
    const result = await getReportDetailsData({
      data: { reportId: params.id },
    });

    if (!result.success || !result.data) {
      throw notFound();
    }

    return result.data;
  },
  component: ReportDetailsRoute,
});

function ReportDetailsRoute() {
  const report = Route.useLoaderData();

  return <ReportDetails report={report} />;
}
