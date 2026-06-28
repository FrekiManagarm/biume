import { createFileRoute } from "@tanstack/react-router";

import { ClientsTable } from "@/components/dashboard/pages/clients";
import { getClientsData } from "#app/lib/product-data";
import { readNumberSearch, readStringSearch } from "#app/lib/search";

export const Route = createFileRoute("/dashboard/clients")({
  validateSearch: (search) => search as { search?: string; page?: number },
  loaderDeps: ({ search }) => ({
    search: readStringSearch(search.search),
    page: readNumberSearch(search.page),
  }),
  loader: async ({ deps }) => getClientsData({ data: deps }),
  component: ClientsRoute,
});

function ClientsRoute() {
  const items = Route.useLoaderData();
  const { search, page } = Route.useLoaderDeps();

  return (
    <ClientsTable items={items} initialSearch={search} initialPage={page} />
  );
}
