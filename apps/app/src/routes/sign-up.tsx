import { createFileRoute } from "@tanstack/react-router";

import SignUpForm from "@/components/auth/sign-up-form";

export const Route = createFileRoute("/sign-up")({
  component: SignUpRoute,
  head: () => ({
    meta: [
      { title: "Inscription | Créez votre compte Biume" },
      {
        name: "description",
        content:
          "Créez votre compte Biume pour produire des comptes rendus anatomiques professionnels et compréhensibles.",
      },
    ],
  }),
});

function SignUpRoute() {
  return <SignUpForm />;
}
