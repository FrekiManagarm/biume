import DashboardLayout from "@/components/dashboard/layout";
import { LayoutCacheProvider } from "@/components/layout/layout-cache";

const DashboardOrganizationLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <LayoutCacheProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </LayoutCacheProvider>
  );
};

export default DashboardOrganizationLayout;
