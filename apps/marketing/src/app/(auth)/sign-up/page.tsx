import type { Metadata } from "next";
import SignUpForm from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Inscription | Créez votre compte Biume",
  description:
    "Rejoignez Biume, l'application santé animale avec assistants IA pour thérapeutes animaliers. Créez votre compte gratuitement et simplifiez votre pratique quotidienne.",
  keywords: [
    "inscription biume",
    "créer compte biume",
    "inscription thérapeute animalier",
    "compte gratuit ostéopathe animalier",
    "inscription application santé animale",
    "biume sign up",
    "inscription professionnel animalier",
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
    url: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
    siteName: "Biume",
    title: "Inscription | Créez votre compte Biume",
    description:
      "Rejoignez Biume, l'application santé animale avec assistants IA pour thérapeutes animaliers. Créez votre compte gratuitement.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/register-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Inscription Biume - Application santé animale avec assistants IA",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@biume",
    creator: "@biume",
    title: "Inscription | Créez votre compte Biume",
    description:
      "Rejoignez Biume, l'application santé animale avec assistants IA pour thérapeutes animaliers.",
    images: [
      `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/register-image.jpg`,
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
  },
};

export default async function SignUpPage() {
  return <SignUpForm />;
}
