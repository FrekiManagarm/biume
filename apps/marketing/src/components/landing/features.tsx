"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  FileText,
  History,
  Languages,
  Sparkles,
} from "lucide-react";

const features = [
  {
    eyebrow: "Rapport",
    title: "Transformer vos notes en compte rendu anatomique",
    description:
      "Structure claire, zones travaillées, recommandations et export PDF dans un document prêt à envoyer.",
    icon: FileText,
  },
  {
    eyebrow: "Propriétaire",
    title: "Expliquer sans perdre votre précision",
    description:
      "Une version vulgarisée aide le propriétaire à comprendre ce qui a été observé, traité et conseillé.",
    icon: Languages,
  },
  {
    eyebrow: "Suivi",
    title: "Garder l'historique de chaque animal",
    description:
      "Les séances, zones suivies et conseils restent reliés au même patient pour reprendre le fil facilement.",
    icon: History,
  },
  {
    eyebrow: "Cabinet",
    title: "Organiser autour du rapport",
    description:
      "Clients, animaux, documents et rendez-vous soutiennent le compte rendu sans devenir la promesse principale.",
    icon: CalendarCheck,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/4 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="mb-12 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end"
          >
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/6 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                Ce que Biume fait
              </div>
              <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Un meilleur rapport, pas un logiciel de plus
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:justify-self-end md:text-lg">
              Biume part du moment le plus important après la séance : produire
              un compte rendu clair, professionnel et utile pour le suivi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-border/45 bg-card/60 shadow-[0_24px_80px_-60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="divide-y divide-border/35">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + index * 0.04 }}
                  className="grid gap-4 p-5 md:grid-cols-[180px_1fr] md:gap-8 md:p-7"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {feature.eyebrow}
                    </p>
                  </div>
                  <div className="grid gap-2 md:grid-cols-[0.9fr_1.1fr] md:gap-8">
                    <h3 className="text-lg font-semibold leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid border-t border-border/35 bg-background/35 md:grid-cols-2">
              <div className="border-b border-border/35 p-5 md:border-b-0 md:border-r md:p-7">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Outils de gestion
                </p>
                <p className="text-base font-semibold md:text-lg">
                  Ils organisent l'activité.
                </p>
              </div>
              <div className="bg-primary/5 p-5 md:p-7">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  Biume
                </p>
                <p className="text-base font-semibold md:text-lg">
                  Il produit le rapport que le propriétaire comprend et que le
                  praticien garde.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
