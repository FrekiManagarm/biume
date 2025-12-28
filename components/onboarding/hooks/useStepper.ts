import { defineStepper } from "@stepperize/react";

export const { steps, useStepper, utils } = defineStepper(
  {
    id: "start",
    title: "Bienvenue",
    description: "Bienvenue dans l'inscription de votre entreprise !",
  },
  {
    id: "informations",
    title: "Informations",
    description:
      "Renseignez les informations de base de votre entreprise pour créer le compte de votre établissement.",
  },
);
