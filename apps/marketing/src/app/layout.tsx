import "@biume/ui/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Biume - Comptes rendus anatomiques pour praticiens animaliers",
  description:
    "Transformez chaque consultation animale en compte rendu anatomique clair, professionnel et pret a envoyer.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
