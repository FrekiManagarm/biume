"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const monthlyPrice = 29.99;
  const annualPrice = 24.99;
  const displayPrice = isAnnual ? annualPrice : monthlyPrice;

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Un tarif unique, <br/>
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">tout inclus</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Accédez à toutes les fonctionnalités sans limite.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="p-1 bg-muted/50 backdrop-blur-sm rounded-full border border-border/50 flex items-center gap-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Annuel
              <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">-25%</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent blur-3xl -z-10" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-foreground">{displayPrice}€</span>
                    <span className="text-muted-foreground">/mois</span>
                 </div>
                 {isAnnual && (
                   <p className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/10 px-3 py-1 rounded-full inline-block">
                     Vous économisez {(monthlyPrice * 12 - annualPrice * 12).toFixed(0)}€ par an
                   </p>
                 )}
                 <p className="text-muted-foreground">
                   Une solution complète pour gérer votre activité de A à Z.
                   Sans frais cachés. Annulable à tout moment.
                 </p>
                 <Button size="lg" className="w-full rounded-full h-12 text-base shadow-lg shadow-primary/20" asChild>
                   <Link href="/sign-up">Commencer l'essai gratuit (15j)</Link>
                 </Button>
                 <p className="text-xs text-center text-muted-foreground">Pas de carte bancaire requise</p>
              </div>

              <div className="space-y-4">
                <div className="font-semibold mb-2">Tout ce qui est inclus :</div>
                {[
                  "Assistant IA illimité",
                  "Rapports PDF personnalisés",
                  "Clients & Patients illimités",
                  "Agenda intelligent & Trajets",
                  "Stockage documents médicaux",
                  "Support prioritaire 7j/7"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

