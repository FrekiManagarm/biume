import { ClientsTable } from "@/components/dashboard/pages/clients";
import { clientsSearchCache } from "@/app/(main)/dashboard/clients/search-params";
import { getAllClients } from "@/lib/api/actions/clients.action";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ClientsPage = async ({ searchParams }: Props) => {
  const { search, page } = await clientsSearchCache.parse(searchParams);
  const items = await getAllClients({ search, page, limit: 10 });
  return (
    <ClientsTable items={items!} initialSearch={search} initialPage={page} />
  );
};

export default ClientsPage;
