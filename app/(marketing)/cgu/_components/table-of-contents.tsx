"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "definitions", title: "Définitions" },
  { id: "inscription", title: "Inscription et compte" },
  { id: "utilisation", title: "Utilisation du service" },
  { id: "propriete", title: "Propriété intellectuelle" },
  { id: "donnees", title: "Protection des données" },
  { id: "responsabilite", title: "Limitation de responsabilité" },
  { id: "modifications", title: "Modifications des conditions" },
  { id: "contact", title: "Contact" },
];

export function TableOfContents() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 bg-linear-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 bg-linear-to-br from-background to-accent/5 border-2">
            <h2 className="text-2xl font-bold mb-6">Table des matières</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors text-left group"
                >
                  <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">{section.title}</span>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
