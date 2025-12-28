import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { HeroSection } from "./_components/hero-section";
import { ContactInfoSection } from "./_components/contact-info-section";
import { ContactFormSection } from "./_components/ContactForm";
import { FAQSection } from "./_components/faq-section";

export const metadata: Metadata = {
  title:
    "Contact Biume | Support Application Santé Animale avec IA - Réponse 24h",
  description:
    "Contactez Biume pour toute question sur notre application santé animale avec assistants IA. Démo gratuite des assistants IA pour thérapeutes animaliers, support rapide, réponse sous 24h. Email : contact@biume.com",
  keywords: [
    "contact biume",
    "support application santé animale",
    "démo assistants IA",
    "assistance thérapeute animalier",
    "service client biume",
    "aide outil ostéopathe",
    "question IA santé animale",
    "démo rapports ostéopathie",
    "contact@biume.com",
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
    url: "https://biume.com/contact",
    siteName: "Biume",
    title: "Contact Biume | Support Application Santé Animale avec IA",
    description:
      "Contactez Biume pour toute question sur nos assistants IA. Démo gratuite, support rapide, réponse sous 24h. Nous sommes à votre écoute.",
    images: [
      {
        url: "https://biume.com/og-image-contact.png",
        width: 1200,
        height: 630,
        alt: "Contactez Biume - Support application santé animale avec IA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@biume",
    creator: "@biume",
    title: "Contact Biume | Support Application Santé Animale avec IA",
    description:
      "Contactez Biume pour découvrir nos assistants IA pour thérapeutes animaliers. Démo gratuite, réponse sous 24h.",
    images: ["https://biume.com/og-image-contact.png"],
  },
  alternates: {
    canonical: "https://biume.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />

      <main className="flex-1 pt-16">
        <HeroSection />
        <ContactInfoSection />
        <ContactFormSection />
        <FAQSection />
      </main>
    </div>
  );
}
