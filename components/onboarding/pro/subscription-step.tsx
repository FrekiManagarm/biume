"use client";

import { Check, CreditCard, Info, Loader2, Shield } from "lucide-react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useActiveOrganization } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useCustomer } from "autumn-js/react";
import CheckoutDialog from "@/components/autumn/checkout-dialog";
import { allInclusiveYearly, allInclusiveMonthly } from "@/autumn.config";
import { logger } from "@/lib/utils/logger";

const features = [
  "Gestion clients illimités",
  "Agenda en ligne",
  "Réservations en ligne",
  "Notifications et rappels",
  "Comptabilité automatisée",
  "Comptes rendus illimités",
  "SLA 99,9%",
  "Support 24/7",
];

export function SubscriptionStep() {
  const { data: activeOrg } = useActiveOrganization();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { attach } = useCustomer();

  // Prix
  const monthlyPrice = 24.99;
  const annualPrice = 19.99;
  const displayPrice = isAnnual ? annualPrice : monthlyPrice;
  const annualTotal = annualPrice * 12;
  const savings = monthlyPrice * 12 - annualTotal;

  // Souscription
  const handleSubscription = async () => {
    try {
      setIsLoading(true);

      const productId = isAnnual
        ? allInclusiveYearly.id
        : allInclusiveMonthly.id;

      await attach({
        productId: productId,
        dialog: CheckoutDialog,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/transactions/subscriptions/success?org=${activeOrg?.id}`,
      });
    } catch (error) {
      setIsLoading(false);
      logger.error("Error subscribing to product", error);
      toast.error("Une erreur est survenue lors de la souscription");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Titre et description invisibles pour l'accessibilité */}
      <DialogTitle className="sr-only">Votre abonnement Biume</DialogTitle>
      <DialogDescription className="sr-only">
        Découvrez notre tarif unique tout inclus avec 30 jours d&apos;essai
        gratuit.
      </DialogDescription>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6 px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
              <CreditCard className="w-4 h-4" />
              <span>Abonnement Biume</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Un seul tarif,{" "}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                tout inclus
              </span>
            </h2>
            <p className="text-muted-foreground">Sans surprise, sans limite</p>
          </motion.div>

          {/* Information importante sur la carte bancaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-3">
                    💳 Informations importantes sur le paiement
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Carte bancaire requise :</strong> Nous vous
                        demanderons votre carte pour activer votre période
                        d&apos;essai
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Aucun débit immédiat :</strong> Vous ne serez
                        débité qu&apos;à la fin de votre période d&apos;essai
                        (30 jours)
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Rappels automatiques :</strong> Vous recevrez
                        plusieurs emails de rappel avant la fin de votre essai
                      </p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-900 dark:text-amber-200">
                          <strong>Pas convaincu ?</strong> Annulez à tout moment
                          pendant votre période d&apos;essai et vous ne serez
                          jamais débité. C&apos;est simple et sans frais.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Toggle Mensuel/Annuel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
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
                    -20%
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Carte de tarification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-xl p-6 md:p-8 overflow-hidden"
          >
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
                  {annualTotal.toFixed(0)}€/an • Économisez {savings.toFixed(0)}
                  €
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
                ✨ Essai gratuit de 30 jours
              </p>
              <p className="text-xs text-muted-foreground">
                Sans engagement • Annulation à tout moment
              </p>
            </div>

            {/* Bouton CTA */}
            <Button
              size="lg"
              variant="default"
              className="w-full"
              disabled={isLoading}
              onClick={handleSubscription}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>En cours...</span>
                </>
              ) : (
                "Commencer l'essai gratuit"
              )}
            </Button>

            <p className="relative text-center text-xs text-muted-foreground mt-4">
              🔒 Paiement sécurisé • Sans engagement
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
