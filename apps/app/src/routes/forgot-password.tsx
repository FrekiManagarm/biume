import { createFileRoute } from "@tanstack/react-router";

import ForgotPasswordPage from "#app/components/auth/forgot-password-page";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordRoute,
  head: () => ({
    meta: [{ title: "Mot de passe oublié | Biume" }],
  }),
});

function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
