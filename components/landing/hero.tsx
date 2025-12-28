"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Sparkles,
  FileText,
  Brain,
  ChevronRight,
  Search,
  LayoutDashboard,
  Calendar,
  Settings,
  History,
  Languages,
} from "lucide-react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "start end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-background" />
        {/* Animated Gradients - Plus subtils */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>L'IA au service de la santé animale</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground text-balance"
          >
            Simplifiez votre pratique <br />
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              avec intelligence
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed"
          >
            Générez des rapports détaillés, accédez à l'historique intelligent et vulgarisez vos diagnostics pour vos clients en un clic.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4"
          >
            <Button
              size="lg"
              className="rounded-full h-12 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-full sm:w-auto"
              asChild
            >
              <Link href="/sign-up">
                Commencer gratuitement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-8 text-base backdrop-blur-sm bg-background/50 w-full sm:w-auto group"
              asChild
            >
              <Link
                href="https://cal.com/mathieu-chambaud-biume"
                target="_blank"
              >
                <Play className="mr-2 w-4 h-4 fill-foreground group-hover:scale-110 transition-transform" />
                Voir la démo
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Interface Unifiée Simplifiée */}
        <motion.div
          style={{ y, opacity }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-xl border border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-border/50">
            {/* Window Bar */}
            <div className="h-10 border-b border-border/40 bg-muted/30 flex items-center px-4 gap-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-5 w-64 bg-background/50 rounded-md border border-border/20 flex items-center justify-center gap-2">
                  <span className="w-3 h-3 text-muted-foreground/50">
                    <Search className="w-3 h-3" />
                  </span>
                  <span className="text-[10px] text-muted-foreground/50">biume.app/dashboard/reports/edit</span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            <div className="flex h-[500px]">
              {/* Sidebar Simplifiée */}
              <div className="w-16 border-r border-border/40 bg-muted/10 flex flex-col items-center py-4 gap-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-transparent text-muted-foreground hover:bg-muted/50 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="mt-auto w-8 h-8 rounded-lg bg-transparent text-muted-foreground hover:bg-muted/50 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex bg-background/50">
                {/* Report Editor */}
                <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
                  {/* Header Rapport */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Rapport de consultation</h3>
                      <p className="text-sm text-muted-foreground">Rocky • Ostéopathie • 28 Dec</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Sauvegardé
                      </div>
                    </div>
                  </div>

                  {/* Editor Area */}
                  <div className="flex-1 space-y-6">
                    {/* Section 1: Observation */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">1</div>
                        Observations cliniques
                      </div>
                      <div className="p-4 rounded-lg border border-border/50 bg-background/50 space-y-2">
                        <div className="h-4 bg-muted/50 rounded w-3/4" />
                        <div className="h-4 bg-muted/50 rounded w-1/2" />
                      </div>
                    </div>

                    {/* Section 2: Active Editing */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">2</div>
                        Dysfonctions anatomiques
                      </div>
                      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-4 ring-1 ring-primary/10">
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded bg-background border border-border text-xs text-foreground">T12</span>
                          <span className="px-2 py-1 rounded bg-background border border-border text-xs text-foreground">L1</span>
                          <span className="px-2 py-1 rounded bg-background border border-border text-xs text-foreground">Sacrum</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="w-1 h-4 bg-primary animate-pulse" />
                          Saisie en cours...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Sidebar Panel */}
                <div className="w-80 border-l border-border/40 bg-muted/5 p-6 hidden md:flex flex-col gap-6">
                  {/* AI Header */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                    <Brain className="w-4 h-4" />
                    Assistant Biume
                  </div>

                  {/* Feature 1: History Analysis */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Analyse historique</p>
                    <div className="p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-purple-200/50 dark:border-purple-800/50 shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <History className="w-4 h-4 text-purple-500 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-foreground">Récurrence détectée</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Blocage L1 déjà présent lors des 2 dernières séances (Mai, Sept).
                          </p>
                          <div className="flex gap-2 pt-1">
                            <span className="text-[10px] text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded">
                              Attention requise
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature 2: Vulgarisation */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vulgarisation Client</p>
                    <div className="p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-green-200/50 dark:border-green-800/50 shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <Languages className="w-4 h-4 text-green-600 mt-0.5" />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-foreground">Traduction auto.</p>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          </div>
                          <div className="text-[11px] space-y-1">
                            <p className="text-red-500 line-through opacity-60">Dysfonction somatique T12</p>
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <ChevronRight className="w-3 h-3" />
                              Blocage vertèbre dorsale
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto">
                    <Button className="w-full bg-linear-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-xs h-9">
                      <Sparkles className="w-3 h-3 mr-2" />
                      Générer la synthèse
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Effect Simplifié */}
          <div className="absolute -inset-4 bg-linear-to-r from-primary/10 via-purple-500/10 to-blue-500/10 blur-3xl -z-10 opacity-50" />
        </motion.div>
      </div>
    </section>
  );
}
