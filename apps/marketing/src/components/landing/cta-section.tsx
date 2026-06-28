"use client";

import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FileText,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { productAppHref } from "@/lib/config/product-app-url";

const benefits = [
  "Un ancien rapport transformé en exemple concret",
  "Une version professionnelle et une version propriétaire",
  "Vos premiers patients, modèles et habitudes pris en compte",
  "Aucun engagement si le résultat ne vous parle pas",
];

const signUpHref = productAppHref("/sign-up");

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/4 rounded-full blur-[120px]" />
      </div>

      <div className="container px-4 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/6 border border-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Le meilleur test est un vrai cas
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            Essayez Biume avec un rapport{" "}
            <span className="bg-linear-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              que vous avez déjà écrit
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pas besoin d&apos;imaginer. Prenez une consultation passée, faites-la
            passer dans Biume, et voyez si le rendu mérite d&apos;entrer dans
            votre routine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-xl shadow-black/2 dark:shadow-black/10 p-8 md:p-12 overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-primary/3 to-transparent pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Un premier essai très concret
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                L&apos;objectif n&apos;est pas de vous vendre une plateforme entière
                dès le premier clic. C&apos;est de vérifier si Biume rend vos
                rapports plus clairs, plus beaux et plus utiles.
              </p>

              <div className="space-y-3 mb-8">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full shadow-lg shadow-primary/15 hover:shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Link href={signUpHref}>
                    Transformer mon premier rapport
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  <Link
                    href="https://cal.com/mathieu-chambaud-biume"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demander une démo
                  </Link>
                </Button>
              </div>
            </div>

            {/* Product proof */}
            <div className="relative">
              <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur-lg p-7 md:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rapport de séance</p>
                    <p className="text-xs text-muted-foreground">
                      Synthèse prête à envoyer
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-border/35 bg-card/70 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Côté praticien
                    </p>
                    <p className="text-sm leading-relaxed">
                      Dysfonction T12-L1, hypomobilité sacro-iliaque droite,
                      recommandations de suivi.
                    </p>
                  </div>

                  <div className="rounded-xl border border-secondary/25 bg-secondary/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Languages className="w-3.5 h-3.5 text-secondary" />
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                        Côté propriétaire
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed">
                      Zone du dos moins mobile et bassin droit à surveiller,
                      avec conseils simples avant la prochaine séance.
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 px-4 py-2 rounded-full bg-card border border-border/50 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold">
                    Testable en 15 jours
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
