import { createFileRoute } from "@tanstack/react-router";

import SubscriptionSuccessComponent from "@/components/subscription/success";
import { readStringSearch } from "#app/lib/search";

export const Route = createFileRoute("/transactions/subscriptions/success")({
  validateSearch: (search) => search as { orgId?: string },
  loaderDeps: ({ search }) => ({
    orgId: readStringSearch(search.orgId),
  }),
  component: SubscriptionSuccessRoute,
});

function SubscriptionSuccessRoute() {
  const { orgId } = Route.useLoaderDeps();

  return <SubscriptionSuccessComponent orgId={orgId} />;
}
