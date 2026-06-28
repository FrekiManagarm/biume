"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Sparkles,
  Languages,
  Zap,
} from "lucide-react";
import { productAppHref } from "@/lib/config/product-app-url";

const practitionerSignals = [
  "Ostéopathes animaliers",
  "Suivi canin, félin, équin",
  "Rapports prêts à envoyer",
];

const signUpHref = productAppHref("/sign-up");

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* --- Background --- */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-primary/[0.07] rounded-full blur-[140px]" />
        <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[35%] w-[400px] h-[400px] bg-primary/4 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.08) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* --- Text Content --- */}
        <div className="mx-auto mb-16 flex max-w-4xl flex-col items-center space-y-7 text-center md:mb-20">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/6 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Comptes rendus augmentés pour pros animaliers
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            Des comptes rendus{" "}
            <span className="relative inline-block">
              <span className="bg-linear-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                clairs et visuels
              </span>
              <svg
                className="absolute -bottom-1.5 left-0 h-3 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 9C60 3 120 3 160 6C200 9 250 5 298 7"
                  stroke="hsl(148 71% 45% / 0.35)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Biume transforme vos observations en rapports professionnels :
            anatomie annotée, vulgarisation pour le propriétaire et historique
            patient prêt pour la prochaine séance.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-col items-center gap-4 pt-2 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-12 rounded-full px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/30 active:scale-[0.98]"
              asChild
            >
              <Link href={signUpHref}>
                Transformer un rapport
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="group h-12 rounded-full px-8 text-base"
              asChild
            >
              <Link
                href="https://cal.com/mathieu-chambaud-biume"
                target="_blank"
              >
                <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 transition-colors group-hover:bg-primary/10">
                  <Play className="ml-0.5 h-3 w-3 fill-foreground" />
                </span>
                Voir la démo
              </Link>
            </Button>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground"
          >
            <span>Essai gratuit 15 jours</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="hidden sm:block">Sans carte bancaire</span>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-1"
          >
            {practitionerSignals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-border/40 bg-card/45 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
              >
                {signal}
              </span>
            ))}
          </motion.div>
        </div>

        {/* --- Product Mockup: Vulgarisation avant/après --- */}
        <motion.div style={{ y: mockupY, opacity: mockupOpacity }}>
          <div className="relative mx-auto max-w-5xl px-4 md:px-8">
            <div className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[720px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-[2rem] border border-border/45 bg-card/65 shadow-[0_28px_90px_-68px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            >
              <div className="flex flex-col gap-3 border-b border-border/35 bg-background/35 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">
                    Transformation du compte rendu
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vocabulaire praticien conservé, lecture propriétaire simplifiée
                </p>
              </div>

              <div className="grid gap-0 md:grid-cols-[1fr_88px_1fr]">
                <div className="p-5 md:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Version praticien
                    </span>
                    <span className="h-px flex-1 bg-border/45" />
                  </div>
                  <div className="rounded-2xl border border-border/40 bg-background/45 p-5">
                    <p className="text-sm font-medium leading-relaxed text-foreground/80 md:text-base">
                      Dysfonction somatique T12-L1, restriction de mobilité
                      vertébrale. Hypomobilité sacro-iliaque droite. À revoir
                      sur prochaine consultation.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center justify-center border-y border-border/35 px-5 py-4 md:border-x md:border-y-0 md:px-0">
                  <div className="absolute hidden h-full w-px bg-linear-to-b from-transparent via-border to-transparent md:block" />
                  <div className="absolute block h-px w-full bg-linear-to-r from-transparent via-border to-transparent md:hidden" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/15">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Languages className="h-3.5 w-3.5 text-secondary" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary">
                      Version propriétaire
                    </span>
                    <span className="h-px flex-1 bg-secondary/20" />
                  </div>
                  <div className="rounded-2xl border border-secondary/25 bg-secondary/10 p-5 ring-1 ring-secondary/10">
                    <p className="text-sm font-medium leading-relaxed text-foreground md:text-base">
                      Zone de tension au milieu du dos et bassin droit moins
                      mobile. Travail réalisé aujourd&apos;hui, points à surveiller
                      avant la prochaine séance.
                    </p>
                    <p className="mt-4 flex items-center gap-2 text-xs font-medium text-secondary">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
                      Compréhensible sans perdre la précision
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
