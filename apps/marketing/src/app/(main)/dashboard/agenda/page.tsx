import { CalendarView } from "@/components/dashboard/pages/agenda";
import { getAppointments } from "@/lib/api/actions/appointments.action";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";
import { Suspense } from "react";
import DashboardOrganizationTimetableLoading from "./loading";

const DashboardAgendaPage = async () => {
  const [appointments, organization] = await Promise.all([
    getAppointments(),
    getCurrentOrganization(),
  ]);

  return (
    <div className="h-full w-full flex flex-col">
      <Suspense fallback={<DashboardOrganizationTimetableLoading />}>
        <CalendarView appointments={appointments} organizationId={organization.id} />
      </Suspense>
    </div>
  );
};

export default DashboardAgendaPage;
