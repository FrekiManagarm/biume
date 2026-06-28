import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { HeroSection } from "./_components/hero-section";
import { TableOfContents } from "./_components/table-of-contents";
import { CGUContentSection } from "./_components/cgu-content-section";

export const metadata: Metadata = {
  title: "CGU Biume | Conditions Générales Application Santé Animale avec IA",
  description:
    "Conditions Générales d'Utilisation Biume. Vos droits et obligations, modalités d'abonnement, utilisation de l'application santé animale avec assistants IA. Mentions légales complètes.",
  keywords: [
    "CGU biume",
    "conditions générales utilisation",
    "mentions légales application santé animale",
    "termes utilisation assistants IA",
    "règlement plateforme santé animale",
    "contrat outil thérapeute animalier",
    "droits utilisateur ostéopathe",
    "obligations thérapeute animalier",
  ],
  authors: [{ name: "Biume" }],
  creator: "Biume",
  publisher: "Biume",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    url: "https://biume.com/cgu",
    siteName: "Biume",
    title: "CGU Biume | Conditions Générales Application Santé Animale",
    description:
      "Conditions Générales d'Utilisation Biume. Droits et obligations, modalités d'abonnement, utilisation de l'application santé animale avec IA.",
    images: [
      {
        url: "https://biume.com/og-image-cgu.png",
        width: 1200,
        height: 630,
        alt: "CGU Biume - Conditions Générales application santé animale avec IA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@biume",
    creator: "@biume",
    title: "CGU Biume | Conditions Générales Application Santé Animale",
    description:
      "Conditions Générales d'Utilisation de l'application santé animale avec assistants IA pour thérapeutes.",
    images: ["https://biume.com/og-image-cgu.png"],
  },
  alternates: {
    canonical: "https://biume.com/cgu",
  },
};

export default function CGUPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />

      <main className="flex-1 pt-16">
        <HeroSection />
        <TableOfContents />
        <CGUContentSection />
      </main>
    </div>
  );
}
