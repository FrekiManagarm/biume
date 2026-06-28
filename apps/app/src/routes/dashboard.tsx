import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { FocusModeWrapper } from "@/components/dashboard/layout/focus-mode-wrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Organization } from "@/lib/schemas";
import { getProductSession } from "#app/lib/product-data";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    const { session } = await getProductSession();

    if (!session) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
      });
    }
  },
  loader: async () => getProductSession(),
  component: DashboardRoute,
});

function DashboardRoute() {
  const { session, organizations } = Route.useLoaderData();

  if (!session) {
    return null;
  }

  return (
    <NuqsAdapter>
      <SidebarProvider>
        <FocusModeWrapper
          sidebar={
            <DashboardSidebar
              session={session}
              organizations={(organizations ?? []) as Organization[]}
            />
          }
          header={
            <SidebarInset className="bg-muted/20">
              <DashboardHeader />
              <div className="w-full flex-1 overflow-y-auto px-5 py-7 md:px-8 lg:px-10">
                <div className="mx-auto w-full max-w-[1480px]">
                  <Outlet />
                </div>
              </div>
            </SidebarInset>
          }
        >
          <Outlet />
        </FocusModeWrapper>
      </SidebarProvider>
    </NuqsAdapter>
  );
}
