"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quel est le délai de réponse moyen ?",
    answer:
      "Notre équipe s'engage à répondre à toutes les demandes dans un délai de 24 heures ouvrées. Pour les demandes urgentes, nous faisons notre possible pour répondre encore plus rapidement.",
  },
  {
    question: "Puis-je demander une démonstration de la plateforme ?",
    answer:
      "Absolument ! Nous proposons des démonstrations personnalisées de notre plateforme. Contactez-nous via le formulaire en précisant votre demande de démo, et nous planifierons un créneau ensemble.",
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les paiements par carte bancaire (Visa, Mastercard, American Express) et par virement bancaire pour les abonnements annuels. Tous les paiements sont sécurisés.",
  },
  {
    question: "Proposez-vous un support technique ?",
    answer:
      "Oui, nous offrons un support technique complet à tous nos utilisateurs. Vous pouvez nous contacter par email et nous vous assisterons pour résoudre tout problème technique.",
  },
  {
    question: "Comment annuler mon abonnement ?",
    answer:
      "Vous pouvez annuler votre abonnement à tout moment depuis votre espace client. Aucun frais d'annulation n'est appliqué et vous conservez l'accès jusqu'à la fin de votre période de facturation en cours.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-linear-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Questions fréquentes
          </h2>
          <p className="text-xl text-muted-foreground">
            Vous trouverez peut-être votre réponse ici
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-linear-to-br from-background to-accent/5 border-2 rounded-xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
