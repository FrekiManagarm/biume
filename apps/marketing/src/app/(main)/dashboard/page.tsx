import DashboardHome from "@/components/dashboard/pages/home";
import { Suspense } from "react";
import DashboardHomeLoading from "./loading";

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardHomeLoading />}>
      <DashboardHome />
    </Suspense>
  );
}
