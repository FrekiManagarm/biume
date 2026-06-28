import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth/auth-server";
import { getAllClients } from "@/lib/api/actions/clients.action";
import { getAppointments } from "@/lib/api/actions/appointments.action";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";
import { getAllPatients } from "@/lib/api/actions/patients.action";
import {
  getAllReports,
  getReportById,
} from "@/lib/api/actions/reports.action";
import { getDashboardWorkbenchData } from "@/lib/api/actions/dashboard.action";
import { getRequest } from "@tanstack/react-start/server";

export const getProductSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequest().headers;
    const [session, organizations] = await Promise.all([
      auth.api.getSession({ headers }),
      auth.api.listOrganizations({ headers }),
    ]);

    return { session, organizations };
  },
);

export const getDashboardHomeData = createServerFn({ method: "GET" }).handler(
  async () => getDashboardWorkbenchData(),
);

export const getAgendaData = createServerFn({ method: "GET" }).handler(
  async () => {
    const [appointments, organization] = await Promise.all([
      getAppointments(),
      getCurrentOrganization(),
    ]);

    return { appointments, organization };
  },
);

export const getClientsData = createServerFn({ method: "GET" })
  .validator(
    (data: { search?: string; page?: number } | undefined) =>
      data ?? { search: "", page: 1 },
  )
  .handler(async ({ data }) =>
    getAllClients({
      search: data.search ?? "",
      page: data.page ?? 1,
      limit: 10,
    }),
  );

export const getPatientsData = createServerFn({ method: "GET" })
  .validator(
    (data: { search?: string; type?: string; page?: number } | undefined) =>
      data ?? { search: "", type: "", page: 1 },
  )
  .handler(async ({ data }) =>
    getAllPatients({
      search: data.search ?? "",
      type: data.type ?? "",
      page: data.page ?? 1,
      limit: 10,
    }),
  );

export const getReportsData = createServerFn({ method: "GET" })
  .validator(
    (data: { search?: string; status?: string } | undefined) =>
      data ?? { search: "", status: "" },
  )
  .handler(async ({ data }) =>
    getAllReports({
      search: data.search ?? "",
      status: data.status ?? "",
    }),
  );

export const getReportDetailsData = createServerFn({ method: "GET" })
  .validator((data: { reportId: string }) => data)
  .handler(async ({ data }) => getReportById({ reportId: data.reportId }));

export const getReportEditorData = createServerFn({ method: "GET" })
  .validator((data: { reportId: string }) => data)
  .handler(async ({ data }) => {
    const [organization, report] = await Promise.all([
      getCurrentOrganization(),
      getReportById({ reportId: data.reportId }),
    ]);

    return { organization, report };
  });

export const getSettingsData = createServerFn({ method: "GET" }).handler(
  async () => getCurrentOrganization(),
);
