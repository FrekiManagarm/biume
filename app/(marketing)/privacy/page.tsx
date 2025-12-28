import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { HeroSection } from "./_components/hero-section";
import { KeyPointsSection } from "./_components/key-points-section";
import { PrivacyContentSection } from "./_components/privacy-content-section";

export const metadata: Metadata = {
  title: "Politique de Confidentialité Biume | Protection RGPD Application Santé Animale",
  description:
    "Politique de confidentialité Biume conforme RGPD pour notre application santé animale avec IA. Protection maximale de vos données, transparence totale, hébergement UE sécurisé. Sécurité des données assistants IA.",
  keywords: [
    "politique confidentialité biume",
    "RGPD application santé animale",
    "protection données IA santé animale",
    "sécurité données thérapeute animalier",
    "données personnelles ostéopathe",
    "vie privée cabinet ostéopathie",
    "RGPD assistant IA",
    "données médicales animaux",
    "hébergement sécurisé données santé",
  ],
  authors: [{ name: "Biume" }],
  creator: "Biume",
  publisher: "Biume",
  formatDetection: {
    email: true,
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
    url: "https://biume.com/privacy",
    siteName: "Biume",
    title: "Politique de Confidentialité Biume | Protection RGPD Application Santé Animale",
    description:
      "Politique de confidentialité Biume conforme RGPD. Protection maximale de vos données dans notre application santé animale avec IA.",
    images: [
      {
        url: "https://biume.com/og-image-privacy.png",
        width: 1200,
        height: 630,
        alt: "Politique de confidentialité Biume - Protection RGPD application santé animale",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@biume",
    creator: "@biume",
    title: "Politique de Confidentialité Biume | Protection RGPD",
    description:
      "Protection RGPD maximale pour l'application santé animale avec IA. Transparence totale sur vos données.",
    images: ["https://biume.com/og-image-privacy.png"],
  },
  alternates: {
    canonical: "https://biume.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />

      <main className="flex-1 pt-16">
        <HeroSection />
        <KeyPointsSection />
        <PrivacyContentSection />
      </main>
    </div>
  );
}
