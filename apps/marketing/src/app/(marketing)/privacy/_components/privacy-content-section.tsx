"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const sections = [
  {
    title: "Introduction",
    content: `Chez Biume, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre service.`,
  },
  {
    title: "Collecte des données",
    content: `Nous collectons les informations que vous nous fournissez directement lorsque vous créez un compte, utilisez notre application ou contactez notre service client. Ces informations peuvent inclure :`,
    list: [
      "Informations d'identification (nom, prénom, adresse email)",
      "Données de profil professionnel",
      "Informations sur vos patients (animaux)",
      "Données d'utilisation et préférences",
      "Informations de paiement (traitées de manière sécurisée)",
    ],
  },
  {
    title: "Utilisation des données",
    content: `Nous utilisons vos données personnelles pour :`,
    list: [
      "Fournir, maintenir et améliorer nos services",
      "Vous envoyer des notifications importantes concernant votre compte",
      "Vous proposer du contenu personnalisé adapté à vos besoins",
      "Améliorer la sécurité de notre plateforme",
      "Répondre à vos demandes et questions",
      "Analyser l'utilisation de nos services pour les améliorer",
    ],
  },
  {
    title: "Protection des données",
    content: `La sécurité de vos données est notre priorité absolue. Nous mettons en œuvre des mesures techniques et organisationnelles robustes pour protéger vos informations contre tout accès non autorisé, modification, divulgation ou destruction. Nos serveurs sont hébergés dans l'Union Européenne et respectent les normes de sécurité les plus strictes.`,
  },
  {
    title: "Partage des données",
    content: `Nous ne partageons pas vos données personnelles avec des tiers, sauf dans les cas suivants :`,
    list: [
      "Avec votre consentement explicite",
      "Avec nos prestataires de service qui nous aident à fournir notre service (hébergement, paiement)",
      "Si nécessaire pour répondre à des obligations légales",
      "Pour protéger nos droits, notre sécurité ou celle de nos utilisateurs",
    ],
  },
  {
    title: "Vos droits (RGPD)",
    content: `Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez de droits concernant vos données personnelles :`,
    list: [
      "Droit d'accéder à vos données personnelles",
      "Droit de rectifier vos données inexactes ou incomplètes",
      "Droit à l'effacement (droit à l'oubli)",
      "Droit à la limitation du traitement",
      "Droit à la portabilité de vos données",
      "Droit d'opposition au traitement de vos données",
      "Droit de retirer votre consentement à tout moment",
    ],
  },
  {
    title: "Cookies et technologies similaires",
    content: `Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Vous pouvez contrôler l'utilisation des cookies via les paramètres de votre navigateur. Les cookies essentiels au fonctionnement du service ne peuvent pas être désactivés.`,
  },
  {
    title: "Conservation des données",
    content: `Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Lorsque vous supprimez votre compte, vos données sont effacées dans un délai de 30 jours, sauf obligation légale de conservation.`,
  },
  {
    title: "Transferts internationaux",
    content: `Vos données sont principalement stockées et traitées dans l'Union Européenne. Si des transferts vers des pays tiers sont nécessaires, nous nous assurons qu'ils bénéficient d'un niveau de protection adéquat conformément au RGPD.`,
  },
  {
    title: "Modifications de la politique",
    content: `Nous pouvons mettre à jour cette politique de confidentialité de temps à autre pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. Les modifications prendront effet dès leur publication sur cette page. Nous vous informerons des changements importants par email.`,
  },
];

export function PrivacyContentSection() {
  return (
    <section className="py-24 bg-linear-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <Card className="p-8 bg-linear-to-br from-background to-accent/5 border-2">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {section.list.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </motion.div>
          ))}

          {/* Section Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="p-8 bg-linear-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Si vous avez des questions concernant cette politique de
                confidentialité ou si vous souhaitez exercer vos droits,
                n&apos;hésitez pas à nous contacter :
              </p>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Email :</strong>{" "}
                  <Link
                    href="mailto:privacy@biume.com"
                    className="text-primary hover:underline"
                  >
                    privacy@biume.com
                  </Link>
                </p>
                <p>
                  <strong>Service client :</strong>{" "}
                  <Link
                    href="mailto:contact@biume.com"
                    className="text-primary hover:underline"
                  >
                    contact@biume.com
                  </Link>
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
