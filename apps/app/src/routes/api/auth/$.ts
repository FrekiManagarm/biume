import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth/auth-server";

const handleAuthRequest = ({ request }: { request: Request }) =>
  auth.handler(request);

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: handleAuthRequest,
      POST: handleAuthRequest,
      PATCH: handleAuthRequest,
      PUT: handleAuthRequest,
      DELETE: handleAuthRequest,
    },
  },
});
