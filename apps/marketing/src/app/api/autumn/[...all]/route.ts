import { autumnHandler } from "autumn-js/next";
import { auth } from "@/lib/auth/auth-server";

export const { GET, POST } = autumnHandler({
  identify: async (req) => {
    const organization = await auth.api.getFullOrganization({
      headers: req.headers,
    });

    if (!organization?.id) {
      return null;
    }

    return {
      customerId: organization.id,
    };
  },
});
