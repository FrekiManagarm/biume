"use client";

import { motion } from "framer-motion";
import { FileText, History, MessageCircle, Sparkles } from "lucide-react";

const tensions = [
  {
    title: "Votre précision reste intacte",
    description:
      "Les termes métier, les zones travaillées et les recommandations gardent leur place.",
    icon: FileText,
  },
  {
    title: "Le propriétaire comprend mieux",
    description:
      "Le compte rendu devient un support de confiance, pas seulement une trace administrative.",
    icon: MessageCircle,
  },
  {
    title: "Le prochain rendez-vous commence mieux",
    description:
      "L'historique anatomique aide à reprendre le fil sans repartir de zéro.",
    icon: History,
  },
];

export function StorySection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[20%] h-[420px] w-[420px] rounded-full bg-secondary/4 blur-[120px]" />
        <div className="absolute bottom-0 right-[12%] h-[360px] w-[360px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/6 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Le vrai moment de valeur
            </div>
            <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Après la séance, il faut encore{" "}
              <span className="text-primary">faire passer le message</span>
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Beaucoup de praticiens font déjà un excellent travail. Le point
              fragile, c&apos;est souvent la restitution : expliquer sans
              appauvrir, documenter sans y passer la soirée, et garder une
              mémoire claire pour le suivi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-border/40 bg-card/50 p-4 shadow-xl shadow-black/2 backdrop-blur-xl dark:shadow-black/10 md:p-5"
          >
            <div className="space-y-3">
              {tensions.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + index * 0.06 }}
                  className="group rounded-2xl border border-border/30 bg-background/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border/60"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-105">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-1.5 font-semibold">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
