import { createFileRoute } from "@tanstack/react-router";

import ReportsPageClient from "@/components/dashboard/pages/reports/client";
import { getReportsData } from "#app/lib/product-data";
import { readStringSearch } from "#app/lib/search";

export const Route = createFileRoute("/dashboard/reports/")({
  validateSearch: (search) => search as { search?: string; status?: string },
  loaderDeps: ({ search }) => ({
    search: readStringSearch(search.search),
    status: readStringSearch(search.status),
  }),
  loader: async ({ deps }) => getReportsData({ data: deps }),
  component: ReportsRoute,
});

function ReportsRoute() {
  const reports = Route.useLoaderData();

  return <ReportsPageClient reports={reports} />;
}
