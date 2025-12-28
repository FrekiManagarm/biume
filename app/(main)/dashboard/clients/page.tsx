import { Suspense } from "react";
import ClientsPage from "@/components/dashboard/pages/clients/clients-page";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const DashboardOrganizationClientsPage = async ({ searchParams }: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientsPage searchParams={searchParams} />
    </Suspense>
  );
};

export default DashboardOrganizationClientsPage;
