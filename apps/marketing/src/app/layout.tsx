import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { StructuredData } from "./structured-data";
import { ProvidersCacheProvider } from "@/components/layout/providers-cache";

const geist = GeistSans;

export async function generateMetadata(): Promise<Metadata> {
  const title =
    "Biume - Application santé animale avec IA pour thérapeutes animaliers";
  const description =
    "Application santé animale dotée d'assistants IA spécialisés : vulgarisation automatique de rapports, planification optimisée et suivi patient proactif. L'outil IA pour thérapeutes animaliers qui simplifie votre pratique quotidienne.";

  return {
    title: {
      default: title,
      template: `%s | Biume`,
    },
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL}`),
    description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        {
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
      title: "Biume",
      statusBarStyle: "default",
      startupImage: {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/apple-touch-icon.png`,
        media: "image/png",
      },
    },
    openGraph: {
      type: "website",
      locale: "fr-FR",
      url: "https://biume.com",
      title,
      description,
      siteName: "Biume",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/cover-image.png`,
          width: 1200,
          height: 630,
          alt: "Biume - Application santé animale avec assistants IA pour thérapeutes animaliers",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/biume-logo.png`,
      ],
      creator: "@BiumeApp",
      site: "@BiumeApp",
    },
    applicationName: "Biume",
    category: "Healthcare Technology",
    classification: "Veterinary Management Software",
    authors: [
      {
        name: "Mathieu Chambaud",
        url: "https://www.linkedin.com/in/mathieu-chambaud-9b4106170/",
      },
      {
        name: "Graig Kolodziejczyk",
        url: "https://www.linkedin.com/in/graig-kolodziejczyk-1482241b8/",
      },
    ],
    creator: "Biume Team",
    publisher: "Biume",
    robots: {
      follow: true,
      index: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
      other: {
        "facebook-domain-verification":
          process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION || "",
      },
    },
    alternates: {
      canonical: "https://biume.com",
      languages: {
        "fr-FR": "https://biume.com",
        "en-US": "https://biume.com/en",
      },
    },
    keywords: [
      // Mots-clés prioritaires IA & santé animale
      "application santé animale",
      "IA santé animale",
      "assistant IA praticien",
      "assistant IA thérapeute animalier",
      "outil thérapeute animalier",
      "rapports ostéopathie animale",
      "IA pour ostéopathe animalier",
      "assistant IA santé animale",

      // Professionnels cibles
      "ostéopathe animalier",
      "naturopathe animalier",
      "masseur animalier",
      "shiatsu animalier",
      "thérapeute animalier",

      // Fonctionnalités IA clés
      "vulgarisation automatique rapports",
      "planification optimisée",
      "planification intelligente",
      "optimisation planning thérapeute",
      "suivi patient IA",
      "détection tendances soins",
      "rapport automatique ostéopathie",
      "traduction vocabulaire médical",

      // Fonctionnalités traditionnelles
      "dossier médical animalier",
      "rapport médical animal",
      "rapport fin de séance",
      "rapport de suivi patient",
      "rapport ostéopathe animalier",
      "rapport naturopathe animalier",
      "créer rapport ostéopathie",
      "biume ai",
      "biume intelligence artificielle",

      // Types d'animaux
      "soins chien",
      "soins chat",
      "soins chevaux",
      "animaux de compagnie",
      "nouveaux animaux de compagnie",
      "NAC",
      "oiseaux",
      "reptiles",

      // Géolocalisation stratégique
      "ostéopathe animalier bordeaux",
      "ostéopathe animalier france",
      "naturopathe animalier france",
      "masseur animalier bordeaux",
      "shiatsu animalier bordeaux",
      "masseur animalier france",
      "shiatsu animalier france",
      "professionnel animalier france",

      // Solutions business
      "gestion animal",
      "entreprise animalière",
      "auto-entrepreneur ostéopathe",
      "auto-entrepreneur naturopathe",
      "auto-entrepreneur masseur",
      "auto-entrepreneur shiatsu",
      "indépendant animalier",

      // Long tail keywords avec IA
      "logiciel ostéopathe animalier avec IA",
      "logiciel gestion animaux intelligence artificielle",
      "application gestion cabinet ostéopathie animale",
      "plateforme soins animaux IA",
      "outil professionnel santé animale",
      "prise rendez-vous animaux automatique",
      "suivi santé animaux intelligent",
      "carnet de santé numérique IA",
      "rapport ostéopathie automatisé",
      "planning optimisé thérapeute animalier",

      // Mots-clés de conversion
      "essai gratuit ostéopathe",
      "tarif logiciel ostéopathe",
      "prix logiciel naturopathe",
      "prix logiciel masseur",
      "prix logiciel shiatsu",
      "abonnement naturopathe",
      "abonnement masseur",
      "abonnement shiatsu",

      // Branded keywords
      "biume",
      "biume application",
      "biume pro",
      "biume ostéopathe",
      "biume naturopathe",
      "biume masseur",
      "biume shiatsu",

      // Concurrence indirecte
      "concurrent neovoice ostéopathe",
      "concurrent neovoice naturopathe",
      "concurrent neovoice masseur",
      "concurrent neovoice shiatsu",
      "concurrent masseur",
      "concurrent shiatsu",
      "agenda professionnel animalier",
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased`}>
        <StructuredData />
        <ProvidersCacheProvider>{children}</ProvidersCacheProvider>
      </body>
    </html>
  );
}
