import { createFileRoute } from "@tanstack/react-router";

import SettingsPageComponent from "@/components/dashboard/pages/settings";
import { getSettingsData } from "#app/lib/product-data";

export const Route = createFileRoute("/dashboard/settings")({
  loader: async () => getSettingsData(),
  component: SettingsRoute,
});

function SettingsRoute() {
  const org = Route.useLoaderData();

  return <SettingsPageComponent org={org} />;
}
