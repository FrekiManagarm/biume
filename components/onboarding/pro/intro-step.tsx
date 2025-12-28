"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, FileText, Brain, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";

const IntroStep = ({ nextStep }: { nextStep: () => void }) => {
  const features = [
    {
      icon: Users,
      title: "Gestion clients & patients",
      description: "Dossiers complets, historique médical, suivi personnalisé",
      emoji: "🐾",
    },
    {
      icon: FileText,
      title: "Rapports intelligents",
      description: "Création intuitive, envoi automatique, export PDF professionnel",
      emoji: "📋",
    },
    {
      icon: Brain,
      title: "Assistant IA et vulgarisation",
      description: "Assistant IA et IA de vulgarisation pour vos clients et communication simplifiée",
      emoji: "🤖",
    },
    {
      icon: BarChart3,
      title: "Tableau de bord",
      description: "Statistiques utiles, performance de votre activité en temps réel",
      emoji: "📊",
    },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Colonne gauche - En-tête et CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left space-y-4"
          >
            <div className="flex justify-center lg:justify-start">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              </motion.div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Bienvenue sur Biume Pro ! 🎉
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Configuration de votre espace professionnel en quelques minutes.
              </p>
            </div>

            {/* CTA dans la colonne gauche */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-3"
            >
              <Button
                size="lg"
                className="px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                onClick={nextStep}
              >
                <span>Commencer la configuration</span>
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-xs text-muted-foreground">
                Nous vous guidons à chaque étape
              </p>
            </motion.div>
          </motion.div>

          {/* Colonne droite - Fonctionnalités */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300"
              >
                <span className="text-xl">{feature.emoji}</span>
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default IntroStep;
