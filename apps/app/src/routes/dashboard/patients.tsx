import { createFileRoute } from "@tanstack/react-router";

import { PatientsTable } from "@/components/dashboard/pages/patients";
import { getPatientsData } from "#app/lib/product-data";
import { readNumberSearch, readStringSearch } from "#app/lib/search";
import type { Pet } from "@/lib/schemas";

export const Route = createFileRoute("/dashboard/patients")({
  validateSearch: (search) =>
    search as { search?: string; type?: string; page?: number },
  loaderDeps: ({ search }) => ({
    search: readStringSearch(search.search),
    type: readStringSearch(search.type),
    page: readNumberSearch(search.page),
  }),
  loader: async ({ deps }) => getPatientsData({ data: deps }),
  component: PatientsRoute,
});

function PatientsRoute() {
  const items = Route.useLoaderData();
  const { search, type, page } = Route.useLoaderDeps();

  return (
    <PatientsTable
      items={items as Pet[]}
      initialSearch={search}
      initialType={type}
      initialPage={page}
    />
  );
}
