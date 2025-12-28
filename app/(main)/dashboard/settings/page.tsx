import SettingsPageComponent from "@/components/dashboard/pages/settings";
import { getCurrentOrganization } from "@/lib/api/actions/auth.action";

const DashboardOrganizationSettingPage = async () => {
  const org = await getCurrentOrganization();

  return <SettingsPageComponent org={org} />;
};

export default DashboardOrganizationSettingPage;
