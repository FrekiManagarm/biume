import { createFileRoute } from "@tanstack/react-router";

import { CalendarView } from "@/components/dashboard/pages/agenda";
import { getAgendaData } from "#app/lib/product-data";

export const Route = createFileRoute("/dashboard/agenda")({
  loader: async () => getAgendaData(),
  component: AgendaRoute,
});

function AgendaRoute() {
  const { appointments, organization } = Route.useLoaderData();

  return (
    <div className="flex h-full w-full flex-col">
      <CalendarView
        appointments={appointments}
        organizationId={organization.id}
      />
    </div>
  );
}
