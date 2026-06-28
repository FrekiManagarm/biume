import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { ResetPasswordFormFallback } from "@/components/auth/reset-password-form-fallback";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordRoute,
  head: () => ({
    meta: [{ title: "Réinitialiser le mot de passe | Biume" }],
  }),
});

function ResetPasswordRoute() {
  return (
    <Suspense fallback={<ResetPasswordFormFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
