import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";
import { Organization } from "@/lib/schemas";
import { DashboardHeader } from "./dashboard-header";
import { OnboardingGuard } from "@/components/onboarding/onboarding-guard";
import { FocusModeWrapper } from "./focus-mode-wrapper";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const [session, organizations] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    auth.api.listOrganizations({
      headers: await headers(),
    }),
  ]);

  return (
    <OnboardingGuard>
      <FocusModeWrapper
        sidebar={
          <DashboardSidebar
            session={session!}
            organizations={organizations! as Organization[]}
          />
        }
        header={
          <SidebarInset>
            <DashboardHeader />
            <div className="w-full overflow-y-auto p-4 mb-4">{children}</div>
          </SidebarInset>
        }
      >
        {children}
      </FocusModeWrapper>
    </OnboardingGuard>
  );
};

export default DashboardLayout;
