"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  FileText,
  Users,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  BarChart3,
  MessageSquare,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/style";
import { Button } from "@/components/ui/button";

const features = [
  {
    id: "ai",
    title: "Intelligence Artificielle",
    subtitle: "Votre copilote au quotidien",
    description:
      "L'IA analyse vos observations en temps réel, reformule vos comptes-rendus en langage professionnel et vous suggère des plans de traitement basés sur l'historique.",
    icon: BrainCircuit,
    color: "bg-violet-500",
    lightColor: "bg-violet-500/10",
    textColor: "text-violet-500",
    previewContent: (
      <div className="space-y-4 p-6 w-full max-w-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-4 h-4 text-violet-600" />
          </div>
          <div className="bg-card border border-border/50 rounded-2xl rounded-tl-none p-4 shadow-sm text-sm">
            <p className="text-muted-foreground mb-2">Analyse de la séance...</p>
            <div className="space-y-2">
              <div className="h-2 w-3/4 bg-violet-100 rounded-full animate-pulse" />
              <div className="h-2 w-1/2 bg-violet-100 rounded-full animate-pulse delay-75" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
          <Sparkles className="w-3 h-3 text-violet-500" />
          Suggestion générée automatiquement
        </div>
      </div>
    ),
  },
  {
    id: "reports",
    title: "Rapports Automatisés",
    subtitle: "Gagnez 2h par jour",
    description:
      "Générez des rapports PDF impeccables en un clic. Personnalisez vos modèles, ajoutez votre logo et laissez Biume s'occuper de la mise en page et de l'envoi.",
    icon: FileText,
    color: "bg-blue-500",
    lightColor: "bg-blue-500/10",
    textColor: "text-blue-500",
    previewContent: (
      <div className="relative w-full max-w-xs aspect-3/4 bg-background border border-border shadow-xl rounded-xl p-6 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-100 mb-2" />
        <div className="space-y-3">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-2 w-full bg-muted/50 rounded" />
          <div className="h-2 w-full bg-muted/50 rounded" />
          <div className="h-2 w-2/3 bg-muted/50 rounded" />
        </div>
        <div className="mt-auto flex gap-2">
          <div className="h-8 flex-1 bg-blue-500/10 rounded border border-blue-500/20" />
          <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "management",
    title: "Suivi Patient 360°",
    subtitle: "Tout au même endroit",
    description:
      "Accédez à l'historique complet de chaque animal : consultations passées, courbes de poids, documents, radios et échanges avec les propriétaires.",
    icon: Users,
    color: "bg-orange-500",
    lightColor: "bg-orange-500/10",
    textColor: "text-orange-500",
    previewContent: (
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <div className="col-span-2 bg-card border border-border p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            R
          </div>
          <div>
            <div className="font-medium text-sm">Rex</div>
            <div className="text-xs text-muted-foreground">Berger Allemand, 5 ans</div>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center">
          <Clock className="w-5 h-5 text-orange-500" />
          <div className="text-xs font-medium">Historique</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center">
          <ShieldCheck className="w-5 h-5 text-orange-500" />
          <div className="text-xs font-medium">Vaccins</div>
        </div>
      </div>
    ),
  },
  {
    id: "agenda",
    title: "Organisation & Trajets",
    subtitle: "Optimisez vos tournées",
    description:
      "Biume synchronise votre agenda et calcule intelligemment vos itinéraires pour réduire vos temps de trajet et vos frais kilométriques.",
    icon: CalendarCheck,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-500/10",
    textColor: "text-emerald-500",
    previewContent: (
      <div className="w-full max-w-md bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="h-24 bg-emerald-500/10 relative">
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm z-10" />
          <div className="absolute top-1/3 left-2/3 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm z-10" />
          <svg className="absolute inset-0 w-full h-full text-emerald-500/30">
            <path d="M100,50 Q200,20 280,40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-background border flex items-center justify-center font-bold text-sm">
              09
            </div>
            <div>
              <div className="text-sm font-medium">Consultation à domicile</div>
              <div className="text-xs text-muted-foreground">32km • 45 min de trajet</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export function FeaturesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-rotation
  useEffect(() => {
    const duration = 5000; // 5s per slide
    const intervalTime = 50; // Update every 50ms
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIdx((current) => (current + 1) % features.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Reset progress whenever activeIdx changes (manual or auto)
  useEffect(() => {
    setProgress(0);
  }, [activeIdx]);

  // Reset progress on manual click
  const handleManualClick = (idx: number) => {
    setActiveIdx(idx);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Content List */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium w-fit">
                <Sparkles className="w-3 h-3" />
                Plateforme tout-en-un
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Conçu pour votre <br />
                <span className="text-primary">tranquillité d'esprit</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
                Libérez-vous des tâches administratives et concentrez-vous sur ce qui compte vraiment : le soin des animaux.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {features.map((feature, idx) => (
                <div
                  key={feature.id}
                  onClick={() => handleManualClick(idx)}
                  className={cn(
                    "group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border",
                    activeIdx === idx
                      ? "bg-card border-primary/20 shadow-md"
                      : "bg-transparent border-transparent hover:bg-muted/50"
                  )}
                >
                  {/* Progress Bar (Vertical for desktop list item or Bottom border?) */}
                  {/* Let's do a subtle background progress or side border */}
                  {activeIdx === idx && (
                    <motion.div
                      layoutId="activeFeatureBackground"
                      className="absolute inset-0 bg-accent/5 rounded-2xl -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex gap-4 items-center justify-start">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                        activeIdx === idx ? feature.lightColor : "bg-muted text-muted-foreground"
                      )}
                    >
                      <feature.icon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          activeIdx === idx ? feature.textColor : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          "font-semibold text-lg transition-colors mb-1",
                          activeIdx === idx ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {feature.title}
                      </h3>
                      <AnimatePresence mode="wait">
                        {activeIdx === idx && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-muted-foreground text-sm leading-relaxed"
                          >
                            {feature.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Progress Indicator for Active Item */}
                  {activeIdx === idx && (
                    <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-muted overflow-hidden rounded-full mt-4">
                      <motion.div
                        className="h-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Preview */}
          <div className="relative h-full rounded-3xl bg-linear-to-b from-muted/50 to-muted/10 border border-border/50 overflow-hidden flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10 w-full h-fit flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  {/* Background Glow Effect */}
                  <div className={cn("absolute inset-0 blur-[80px] opacity-40 rounded-full", features[activeIdx].color)} />

                  {/* Content Container */}
                  <div className="relative h-full bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-2 md:p-6 min-w-[300px] md:min-w-[400px] flex flex-col justify-center items-center">
                    {features[activeIdx].previewContent}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

