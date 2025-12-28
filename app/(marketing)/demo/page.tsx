import { Suspense } from "react";
import { Metadata } from "next";
import DemoClientPage from "./_components/demo-client";
import DemoClientFallback from "./_components/demo-client-fallback";
import { Header } from "@/components/landing/header";

export const metadata: Metadata = {
  title: "Démo Biume | Essayez l'Application Santé Animale avec Assistants IA",
  description:
    "Testez gratuitement Biume, l'application santé animale avec assistants IA pour thérapeutes animaliers. Découvrez la vulgarisation automatique de rapports, la planification optimisée et le suivi patient proactif.",
  keywords: [
    "démo biume",
    "essai gratuit application santé animale",
    "test outil thérapeute animalier",
    "démo IA santé animale",
    "assistant IA ostéopathe",
    "essai logiciel ostéopathie animale",
    "démo rapports ostéopathie",
    "test planning intelligent",
    "démo suivi patient IA",
  ],
  authors: [{ name: "Biume" }],
  creator: "Biume",
  publisher: "Biume",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://biume.com/demo",
    siteName: "Biume",
    title: "Démo Biume | Application Santé Animale avec Assistants IA",
    description:
      "Testez gratuitement Biume et ses 3 assistants IA pour thérapeutes animaliers. Essai sans engagement.",
    images: [
      {
        url: "https://biume.com/og-image-demo.png",
        width: 1200,
        height: 630,
        alt: "Démo Biume - Application santé animale avec IA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@biume",
    creator: "@biume",
    title: "Démo Biume | Application Santé Animale avec Assistants IA",
    description:
      "Testez gratuitement l'application santé animale avec assistants IA pour thérapeutes animaliers.",
    images: ["https://biume.com/og-image-demo.png"],
  },
  alternates: {
    canonical: "https://biume.com/demo",
  },
};

const DemoPage = () => {
  return (
    <div className="flex flex-col h-screen w-full">
      <Header />

      <main className="flex w-full h-full justify-center items-center">
        <Suspense fallback={<DemoClientFallback />}>
          <DemoClientPage />
        </Suspense>
      </main>
    </div>
  );
};

export default DemoPage;
