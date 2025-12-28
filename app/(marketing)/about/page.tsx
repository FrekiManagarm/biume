import { Metadata } from "next/types";
import AboutPageComponent from "./_components/about-page";

export const metadata: Metadata = {
  title: "À propos de Biume | Application Santé Animale avec Assistants IA",
  description:
    "Découvrez Biume : application santé animale dotée d'assistants IA pour thérapeutes animaliers. Vulgarisation automatique, planification optimisée, suivi patient proactif. 500+ professionnels nous font confiance.",
  keywords: [
    "biume",
    "application santé animale",
    "IA santé animale",
    "assistant IA thérapeute animalier",
    "outil thérapeute animalier",
    "ostéopathe animalier",
    "rapports ostéopathie animale",
    "logiciel gestion cabinet ostéopathie",
    "SaaS santé animale avec IA",
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
    url: "https://biume.com/about",
    siteName: "Biume",
    title: "À propos de Biume | Application Santé Animale avec Assistants IA",
    description:
      "Découvrez Biume : application santé animale avec assistants IA pour thérapeutes animaliers. Vulgarisation automatique, planification optimisée, suivi patient proactif.",
    images: [
      {
        url: "https://biume.com/og-image-about.png",
        width: 1200,
        height: 630,
        alt: "À propos de Biume - Application santé animale avec assistants IA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@biume",
    creator: "@biume",
    title: "À propos de Biume | Application Santé Animale avec Assistants IA",
    description:
      "Application santé animale avec 3 assistants IA pour thérapeutes animaliers. 500+ professionnels nous font confiance.",
    images: ["https://biume.com/og-image-about.png"],
  },
  alternates: {
    canonical: "https://biume.com/about",
  },
};

const AboutPage = async () => {
  return <AboutPageComponent />;
};

export default AboutPage;
