"use client";

import {
  BrainCircuit,
  FileText,
  Users,
  CalendarCheck,
  Sparkles,
  Check,
  FileDown,
  Clock,
  Shield,
  ArrowDown,
  FileImage,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/style";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FeaturesSection() {
  const features = [
    {
      id: "ai",
      title: "Assistant Intelligent",
      description: "Un véritable copilote qui vous aide à vulgariser vos observations, analyse l'historique des dysfonctions et optimise vos tournées pour réduire vos trajets.",
      icon: BrainCircuit,
      stats: ["Aide à la vulgarisation", "Optimisation tournées"],
      color: "from-violet-500/20 to-purple-500/20",
      visual: (
        <div className="relative w-full max-w-[350px] aspect-4/3 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full space-y-4">
              {/* Input Card */}
              <div className="bg-background rounded-xl border border-border p-4 shadow-sm w-[90%] mx-auto relative z-10">
                <div className="text-xs font-medium text-muted-foreground mb-1">Observation vétérinaire</div>
                <div className="text-sm font-medium">Dysfonction iliopsoas grade 2 avec compensation lombaire</div>
              </div>
              
              {/* Arrow */}
              <div className="flex justify-center text-primary">
                <ArrowDown className="w-6 h-6 animate-bounce" />
              </div>

              {/* Output Card */}
              <div className="bg-primary/5 rounded-xl border border-primary/20 p-4 shadow-sm w-[90%] mx-auto relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <div className="text-xs font-medium text-primary">Vulgarisation Biume</div>
                </div>
                <div className="text-sm text-foreground/80 italic">
                  "Douleur musculaire importante à la hanche qui oblige le dos à forcer pour compenser."
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "reports",
      title: "Rapports Professionnels",
      description: "Un module de rapports intuitif conçu pour la productivité. Exportez en PDF marque blanche avec votre logo et envoyez-les automatiquement par email une fois terminés.",
      icon: FileText,
      stats: ["PDF Marque blanche", "Envoi automatique"],
      color: "from-blue-500/20 to-cyan-500/20",
      visual: (
        <div className="relative w-full max-w-[350px] aspect-4/3 mx-auto flex items-center justify-center">
          <div className="w-3/4 bg-background rounded-sm shadow-2xl border border-border/50 aspect-[1/1.4] relative flex flex-col transition-transform hover:scale-105 duration-500">
            {/* Header with Logo Placeholder */}
            <div className="h-16 border-b border-border/50 p-4 flex justify-between items-center bg-muted/5">
              <div className="h-8 w-24 bg-muted-foreground/10 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-[8px] text-muted-foreground uppercase tracking-wider font-medium">
                Votre Logo
              </div>
              <div className="text-[8px] text-muted-foreground">
                12 Oct 2024
              </div>
            </div>
            {/* Content */}
            <div className="p-4 space-y-3 flex-1">
              <div className="h-2 w-3/4 bg-muted rounded-full" />
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-muted/30 rounded-full" />
                <div className="h-1.5 w-full bg-muted/30 rounded-full" />
                <div className="h-1.5 w-2/3 bg-muted/30 rounded-full" />
              </div>
              <div className="mt-4 h-2 w-1/2 bg-muted rounded-full" />
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-muted/30 rounded-full" />
                <div className="h-1.5 w-5/6 bg-muted/30 rounded-full" />
              </div>
            </div>
            {/* Sent Badge overlay */}
            <div className="absolute -right-4 top-8 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-12 flex items-center gap-1 animate-in zoom-in duration-500 delay-300">
              <Check className="w-3 h-3" /> Envoyé
            </div>
          </div>
        </div>
      )
    },
    {
      id: "management",
      title: "Gestion Centralisée",
      description: "Gérez vos clients et patients efficacement. Importez et centralisez tous les documents médicaux (radios, analyses) directement dans les dossiers.",
      icon: Users,
      stats: ["Gestion clients/patients", "Import documents"],
      color: "from-orange-500/20 to-amber-500/20",
      visual: (
        <div className="relative w-full max-w-[350px] aspect-4/3 mx-auto">
          <div className="bg-background rounded-xl shadow-lg border border-border overflow-hidden h-full flex flex-col w-[90%] mx-auto">
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-2xl">
                🐴
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Luna</div>
                <div className="text-xs text-muted-foreground">Jument • 8 ans • Léa Dubois</div>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-border">
              <div className="px-4 py-2 text-xs font-medium text-muted-foreground">Général</div>
              <div className="px-4 py-2 text-xs font-medium text-primary border-b-2 border-primary bg-primary/5">Documents</div>
              <div className="px-4 py-2 text-xs font-medium text-muted-foreground">Historique</div>
            </div>
            {/* Grid */}
            <div className="p-4 grid grid-cols-3 gap-2 flex-1 content-start">
              <div className="aspect-square rounded-lg bg-muted/30 border border-border border-dashed flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer group">
                <FileImage className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[8px]">Radio.jpg</span>
              </div>
              <div className="aspect-square rounded-lg bg-muted/30 border border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer group">
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[8px]">Analyses.pdf</span>
              </div>
              <div className="aspect-square rounded-lg bg-muted/30 border border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer group">
                <FileImage className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[8px]">Echo.jpg</span>
              </div>
              <div className="aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground/50 hover:border-primary/50 hover:text-primary/50 transition-colors cursor-pointer">
                <span className="text-xl font-light">+</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "agenda",
      title: "Agenda & Rappels",
      description: "Un agenda intuitif connecté à Google et Apple. Optimisez automatiquement le placement de vos rendez-vous en fonction de la localisation des propriétaires.",
      icon: CalendarCheck,
      stats: ["Synchro calendriers", "Optimisation trajets"],
      color: "from-emerald-500/20 to-teal-500/20",
      visual: (
        <div className="relative w-full max-w-[350px] aspect-4/3 mx-auto">
          <div className="absolute inset-0 bg-muted/20 rounded-xl border border-border overflow-hidden">
            {/* Map Background Mockup */}
            <div className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
              }} 
            />
            
            {/* Route Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M100,80 Q180,120 250,80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-primary/50" />
            </svg>

            {/* Pins */}
            <div className="absolute top-[60px] left-[90px] flex flex-col items-center animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="relative group cursor-pointer">
                <MapPin className="w-8 h-8 text-primary fill-primary/20 drop-shadow-md transition-transform group-hover:-translate-y-1" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background px-2 py-1 rounded text-[10px] font-medium shadow-sm border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  10:00 • Écurie du Val
                </div>
              </div>
            </div>

            <div className="absolute top-[60px] right-[90px] flex flex-col items-center animate-bounce" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
              <div className="relative group cursor-pointer">
                <MapPin className="w-8 h-8 text-primary fill-primary/20 drop-shadow-md transition-transform group-hover:-translate-y-1" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background px-2 py-1 rounded text-[10px] font-medium shadow-sm border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  14:00 • Haras des Pins
                </div>
              </div>
            </div>

            {/* Bottom Optimization Card */}
            <div className="absolute bottom-4 inset-x-4 bg-background/90 backdrop-blur rounded-lg border border-border p-3 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold">Trajet optimisé</div>
                  <div className="text-[10px] text-muted-foreground">24km économisés sur la tournée</div>
                </div>
              </div>
              <div className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                -25 min
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="py-24 overflow-hidden bg-muted/30">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Fonctionnalités</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Tout pour gérer votre activité <br className="hidden md:block" />
            <span className="bg-linear-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
              sans effort
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Une suite d'outils puissants conçus spécifiquement pour les thérapeutes animaliers.
            Gagnez du temps et concentrez-vous sur l'essentiel : le soin.
          </p>
        </div>

        {/* Features List - Alternating Layout */}
        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={cn(
                "flex flex-col gap-12 lg:items-center",
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center bg-linear-to-br shadow-sm",
                    feature.color
                  )}>
                    <feature.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Stats / Badges */}
                <div className="flex flex-wrap gap-3">
                  {feature.stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border shadow-xs text-sm font-medium text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {stat}
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 group">
                    En savoir plus
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Button>
                </div>
              </div>

              {/* Visual Content */}
              <div className="flex-1 relative">
                {/* Decorative background blob */}
                <div className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[60px] opacity-40 -z-10 bg-linear-to-br",
                  feature.color
                )} />

                <div className="relative bg-background/50 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 md:p-12 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] opacity-20" />

                  {/* The Visual Component */}
                  <div className="relative z-10">
                    {feature.visual}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA for Features */}
        <div className="mt-24 text-center">
          <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">
            <Link href="/demo">
              Réserver une démo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


