import { PatientsTable } from "@/components/dashboard/pages/patients";
import { patientsSearchCache } from "./search-params";
import { getAllPatients } from "@/lib/api/actions/patients.action";
import { Pet } from "@/lib/schemas";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const DashboardOrganizationPatientsPage = async ({ searchParams }: Props) => {
  const { search, type, page } = await patientsSearchCache.parse(searchParams);
  const items = await getAllPatients({ search, type, page, limit: 10 });
  return (
    <PatientsTable
      items={items as Pet[]}
      initialSearch={search}
      initialType={type}
      initialPage={page}
    />
  );
};

export default DashboardOrganizationPatientsPage;
