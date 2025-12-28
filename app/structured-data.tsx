import Script from "next/script";

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Biume",
    alternateName: "Biume Pro",
    description:
      "Application santé animale avec assistant IA intelligent pour thérapeutes animaliers. Gestion complète des rapports, clients, patients et agenda.",
    url: "https://biume.com",
    logo: "https://biume.com/assets/images/biume-logo.png",
    image: "https://biume.com/assets/images/pro-capture.png",
    sameAs: [
      "https://www.linkedin.com/company/biume",
      "https://twitter.com/BiumeApp",
      "https://www.facebook.com/BiumeApp",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+33-1-23-45-67-89",
      contactType: "customer service",
      areaServed: "FR",
      availableLanguage: "French",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
      addressLocality: "Bordeaux",
      postalCode: "33000",
    },
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "Mathieu Chambaud",
        sameAs: "https://www.linkedin.com/in/mathieu-chambaud-9b4106170/",
      },
      {
        "@type": "Person",
        name: "Graig Kolodziejczyk",
        sameAs: "https://www.linkedin.com/in/graig-kolodziejczyk-1482241b8/",
      },
    ],
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Biume",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Veterinary Management Software",
    description:
      "Application santé animale avec assistant IA intelligent pour thérapeutes animaliers. Création de rapports professionnels, gestion des clients et patients, agenda optimisé et suivi médical complet.",
    operatingSystem: "Web-based, iOS, Android",
    url: "https://biume.com",
    screenshot: "https://biume.com/assets/images/pro-capture.png",
    offers: [
      {
        "@type": "Offer",
        name: "Plan Essentiel",
        price: "19.99",
        priceCurrency: "EUR",
        billingIncrement: "P1M",
        description: "Pour les petites entreprises et soignants indépendants",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitText: "user",
        },
      },
      {
        "@type": "Offer",
        name: "Plan Professionnel",
        price: "34.99",
        priceCurrency: "EUR",
        billingIncrement: "P1M",
        description:
          "Pour les entreprises en croissance avec plusieurs soignants",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          maxValue: 5,
          unitText: "users",
        },
      },
      {
        "@type": "Offer",
        name: "Plan Entreprise",
        price: "64.99",
        priceCurrency: "EUR",
        billingIncrement: "P1M",
        description: "Pour les grandes structures",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          maxValue: 10,
          unitText: "users",
        },
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Assistant IA intelligent - Assistant conversationnel pour toutes vos tâches quotidiennes",
      "Création de rapports d'ostéopathie animale professionnels illustrés",
      "Gestion complète des dossiers clients et patients",
      "Export PDF automatique et envoi par email",
      "Agenda et gestion des rendez-vous",
      "Historique complet des consultations",
      "Analyse et synthèse des consultations",
      "Suivi médical approfondi",
      "Sécurité et conformité RGPD totale",
      "Support prioritaire et accompagnement",
    ],
    author: {
      "@type": "Organization",
      name: "Biume",
    },
    publisher: {
      "@type": "Organization",
      name: "Biume",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Application santé animale Biume avec assistant IA",
    description:
      "Outil professionnel pour thérapeutes animaliers avec assistant IA intelligent. Création de rapports, gestion des clients et patients, agenda et suivi médical. Simplifie votre pratique quotidienne.",
    provider: {
      "@type": "Organization",
      name: "Biume",
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Professionnels animaliers",
      geographicArea: {
        "@type": "Country",
        name: "France",
      },
    },
    category: "Veterinary Management Software",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Plans d'abonnement Biume",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Plan Essentiel",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Plan Professionnel",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Plan Entreprise",
          },
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Qu'est-ce que Biume ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Biume est une application santé animale avec assistant IA intelligent dédiée aux thérapeutes animaliers. Elle offre un assistant conversationnel qui vous aide dans toutes vos tâches : création de rapports, analyse de consultations, suivi médical et planification de rendez-vous. L'application inclut également la gestion complète des clients, patients et un agenda optimisé.",
        },
      },
      {
        "@type": "Question",
        name: "Quels professionnels peuvent utiliser cette application santé animale ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Biume s'adresse à tous les thérapeutes et professionnels du secteur animalier : ostéopathes animaliers, naturopathes animaliers, masseurs animaliers, praticiens shiatsu et cabinets spécialisés en santé animale. L'outil est particulièrement adapté pour créer des rapports d'ostéopathie animale professionnels.",
        },
      },
      {
        "@type": "Question",
        name: "Biume propose-t-il un essai gratuit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, Biume propose un essai gratuit de 1 mois pour tous ses plans d'abonnement, permettant aux professionnels de tester toutes les fonctionnalités sans engagement.",
        },
      },
      {
        "@type": "Question",
        name: "Qu'est-ce que l'assistant IA de Biume ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Biume propose un assistant IA intelligent et conversationnel qui vous aide dans toutes vos tâches quotidiennes. Il peut créer des rapports, analyser les consultations, faire du suivi médical approfondi, planifier des rendez-vous et répondre à vos questions. L'assistant comprend votre contexte et vous propose des suggestions pertinentes selon la page où vous vous trouvez dans l'application.",
        },
      },
      {
        "@type": "Question",
        name: "Les données sont-elles sécurisées sur Biume ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolument. Biume respecte le RGPD et utilise un cryptage de niveau bancaire pour protéger toutes les données médicales et personnelles. L'accès aux dossiers nécessite le consentement explicite des propriétaires d'animaux.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://biume.com",
      },
    ],
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="software-application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
