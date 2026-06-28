"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const monthlyPrice = 29.99;
  const annualPrice = 24.99;
  const displayPrice = isAnnual ? annualPrice : monthlyPrice;
  const annualTotal = annualPrice * 12;
  const savings = monthlyPrice * 12 - annualTotal;

  const features = [
    "Assistant IA intelligent conversationnel",
    "Comptes rendus illimités",
    "Gestion clients & patients illimitée",
    "Export PDF & envoi automatique",
    "Sécurité RGPD & chiffrement de bout en bout",
    "Support prioritaire 7j/7",
  ];

  return (
    <section id="pricing" className="py-16 md:py-32">
      <div className="container px-4 mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border shadow-lg">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Tarifs</span>
          </div>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Un seul tarif,{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              tout inclus
            </span>
          </h2>
          <p className="text-muted-foreground">Sans surprise, sans limite</p>
        </div>

        {/* Toggle Mensuel/Annuel */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setIsAnnual(false)}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                !isAnnual ? "bg-background shadow-sm" : ""
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                isAnnual ? "bg-background shadow-sm" : ""
              }`}
            >
              Annuel{" "}
              {isAnnual && (
                <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                  -25%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Carte de tarification */}
        <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-xl p-6 md:p-8 overflow-hidden">
          {/* Effet de gradient subtil en haut */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>

          {/* Effet de lueur en bas */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-primary/5 to-transparent pointer-events-none"></div>

          {/* Background subtil pour meilleure visibilité */}
          <div className="absolute inset-0 bg-linear-to-br from-muted/30 to-background/50 -z-10"></div>

          {/* Prix */}
          <div className="relative text-center mb-8 pb-8 border-b border-border">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                {displayPrice.toFixed(2)}€
              </span>
              <span className="text-muted-foreground">/mois</span>
            </div>
            {isAnnual && (
              <p className="text-sm text-muted-foreground">
                {annualTotal.toFixed(0)}€/an • Économisez {savings.toFixed(0)}€
              </p>
            )}
          </div>

          {/* Liste des fonctionnalités */}
          <div className="relative space-y-3 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Essai gratuit */}
          <div className="relative bg-muted/30 backdrop-blur-sm rounded-lg p-4 mb-6 text-center border border-border shadow-sm">
            <p className="text-sm font-medium mb-1">
              ✨ Essai gratuit de 15 jours
            </p>
            <p className="text-xs text-muted-foreground">
              Annulation à tout moment
            </p>
          </div>

          {/* Bouton CTA */}
          <Button asChild size="lg" variant="default" className="w-full">
            <Link href="/sign-up">Commencer l&apos;essai gratuit</Link>
          </Button>

          <p className="relative text-center text-xs text-muted-foreground mt-4">
            🔒 Paiement sécurisé • Sans engagement
          </p>
        </div>

        {/* Contact pour équipes */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Besoin d&apos;une solution pour votre équipe ?
          </p>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Demander un devis</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
