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
import { ProductStatus } from "autumn-js";

export const OnboardingGuard = async ({
  children,
}: React.PropsWithChildren) => {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  const customer = await autumn.customers.get(organization?.id ?? "");

  // console.log(customer, "customer");

  // console.log(customer.data, "customer.data");

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
            customer?.data?.products?.length === 0) ||
          customer?.data?.products?.some(
            (product) => product.status === ProductStatus.Expired,
          )
        }
      />
      {children}
    </>
  );
};
