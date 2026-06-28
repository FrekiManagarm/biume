import { createFileRoute } from "@tanstack/react-router";

import SignInForm from "@/components/auth/sign-in-form";

export const Route = createFileRoute("/sign-in")({
  component: SignInRoute,
  head: () => ({
    meta: [{ title: "Connexion | Biume" }],
  }),
});

function SignInRoute() {
  return <SignInForm />;
}
