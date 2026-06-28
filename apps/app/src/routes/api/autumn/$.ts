import { createFileRoute } from "@tanstack/react-router";
import { autumnHandler } from "autumn-js/fetch";

import { auth } from "@/lib/auth/auth-server";

const handleAutumnRequest = autumnHandler({
  identify: async (request) => {
    const organization = await auth.api.getFullOrganization({
      headers: request.headers,
    });

    if (!organization?.id) {
      return null;
    }

    return {
      customerId: organization.id,
    };
  },
});

export const Route = createFileRoute("/api/autumn/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAutumnRequest(request),
      POST: ({ request }) => handleAutumnRequest(request),
    },
  },
});
