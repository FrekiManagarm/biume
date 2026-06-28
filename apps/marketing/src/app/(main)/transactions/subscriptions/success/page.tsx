import SubscriptionSuccessComponent from "@/components/subscription/success";
import { Suspense } from "react";
import SubscriptionSuccessLoading from "./loading";

const SubscriptionSuccess = async ({
  searchParams,
}: {
  searchParams: Promise<{ orgId: string }>;
}) => {
  const { orgId } = await searchParams;

  return (
    <Suspense fallback={<SubscriptionSuccessLoading />}>
      <SubscriptionSuccessComponent orgId={orgId} />
    </Suspense>
  );
};

export default SubscriptionSuccess;
