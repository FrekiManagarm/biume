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
          <SidebarInset className="bg-muted/20">
            <DashboardHeader />
            <div className="w-full flex-1 overflow-y-auto px-5 py-7 md:px-8 lg:px-10">
              <div className="mx-auto w-full max-w-[1480px]">{children}</div>
            </div>
          </SidebarInset>
        }
      >
        {children}
      </FocusModeWrapper>
    </OnboardingGuard>
  );
};

export default DashboardLayout;
