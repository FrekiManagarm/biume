import Stepper from "./components/stepper";
import { Credenza } from "@/components/ui/credenza";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";
import React from "react";
import OnboardingExplications from "./onboarding-explications";
import OrganizationConnect from "./organization-connect";
import { Organization } from "@/lib/schemas";
import { autumn } from "@/lib/utils/autumn";
import NonPayedSubscriptionModal from "./non-payed-subscription-modal";

export const OnboardingGuard = async ({
  children,
}: React.PropsWithChildren) => {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  const customer = await autumn.customers.getOrCreate({
    customerId: organization?.id || "",
  });

  console.log(customer, "customer");

  if (organizations?.length < 1) {
    return (
      <Credenza open={true}>
        <Stepper />
      </Credenza>
    );
  }

  if (!organization && organizations?.length > 0) {
    return (
      <OrganizationConnect
        open={true}
        organizations={organizations as unknown as Organization[]}
      />
    );
  }

  return (
    <>
      <OnboardingExplications
        open={Boolean(
          organization?.onBoardingComplete &&
          !organization?.onBoardingExplications,
        )}
      />
      <NonPayedSubscriptionModal
        open={
          (organization?.onBoardingComplete &&
            customer?.subscriptions?.length === 0) ||
          customer?.subscriptions?.some((product) => product.status == "active")
        }
      />
      {children}
    </>
  );
};
