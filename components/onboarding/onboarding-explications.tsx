"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Credenza, CredenzaContent } from "../ui/credenza";
import { Button } from "../ui/button";
import {
  FileText,
  Users,
  Calendar,
  Download,
  Send,
  Shield,
  Sparkles,
  Database,
  Brain,
  BarChart3,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Heart,
  Rocket,
  ArrowRight,
  BrainCircuit,
  Lock,
} from "lucide-react";
import { completeOnboardingExplications } from "@/lib/api/actions/organization.action";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "../ui/dialog";
import { useActiveOrganization } from "@/lib/auth/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface OnboardingExplicationsProps {
  open: boolean;
}

const slides = [
  {
    id: "welcome",
    title: "Bienvenue sur Biume ! 🎉",
    subtitle: "Découvrez votre nouvel espace de travail",
    description:
      "Biume transforme votre pratique avec des outils modernes et intuitifs conçus spécialement pour les thérapeutes animaliers.",
    icon: Heart,
    color: "primary",
    features: [
      {
        icon: Zap,
        text: "Configuration en 2 minutes chrono !",
        color: "text-yellow-600",
      },
      {
        icon: Shield,
        text: "Sécurisé et conforme RGPD",
        color: "text-green-600",
      },
    ],
  },
  {
    id: "reports",
    title: "Rapports professionnels",
    subtitle: "Créez et partagez en quelques clics",
    description:
      "Générez des rapports de consultation détaillés avec un éditeur intuitif, exportez-les en PDF et envoyez-les directement à vos clients.",
    icon: FileText,
    color: "blue",
    features: [
      {
        icon: FileText,
        text: "Éditeur intuitif et interactif",
        color: "text-blue-600",
      },
      { icon: Download, text: "Export PDF", color: "text-blue-600" },
      {
        icon: Send,
        text: "Envoi automatique par email",
        color: "text-blue-600",
      },
      {
        icon: Database,
        text: "Sauvegarde automatique",
        color: "text-blue-600",
      },
    ],
    visual: (
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-32 h-24 bg-blue-600 rounded transform -rotate-6" />
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-blue-400 rounded transform rotate-6" />
        </div>
        <FileText className="w-20 h-20 text-blue-600 relative z-10" />
      </div>
    ),
  },
  {
    id: "clients",
    title: "Gestion des clients & patients",
    subtitle: "Tous vos dossiers au même endroit",
    description:
      "Créez des fiches détaillées pour chaque client et ses animaux. Accédez à l'historique complet des consultations et suivez l'évolution de vos patients.",
    icon: Users,
    color: "green",
    features: [
      {
        icon: Users,
        text: "Fiches clients complètes",
        color: "text-green-600",
      },
      {
        icon: Heart,
        text: "Dossiers patients détaillés",
        color: "text-green-600",
      },
      {
        icon: Calendar,
        text: "Historique des consultations",
        color: "text-green-600",
      },
      { icon: Lock, text: "Stockage sécurisé", color: "text-green-600" },
    ],
    visual: (
      <div className="relative w-full h-48 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-24 h-24 bg-green-600 rounded-full" />
          <div className="absolute bottom-8 right-8 w-32 h-32 bg-green-400 rounded-full" />
        </div>
        <Users className="w-20 h-20 text-green-600 relative z-10" />
      </div>
    ),
  },
  {
    id: "ai",
    title: "Intelligence artificielle",
    subtitle: "Communiquez mieux avec vos clients",
    description:
      "Notre IA vous aide à vulgariser les termes techniques pour rendre vos rapports plus accessibles à vos clients.",
    icon: BrainCircuit,
    color: "purple",
    features: [
      {
        icon: Brain,
        text: "Vulgarisation automatique",
        color: "text-purple-600",
      },
      {
        icon: Sparkles,
        text: "Suggestions intelligentes",
        color: "text-purple-600",
      },
    ],
    visual: (
      <div className="relative w-full h-48 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 right-12 w-20 h-20 bg-purple-600 rounded-lg transform rotate-12" />
          <div className="absolute bottom-12 left-8 w-28 h-28 bg-purple-400 rounded-lg transform -rotate-12" />
        </div>
        <Brain className="w-20 h-20 text-purple-600 relative z-10" />
      </div>
    ),
  },
  {
    id: "workflow",
    title: "Votre nouveau flux de travail",
    subtitle: "Simple et efficace",
    description:
      "De la consultation à l'envoi du rapport, Biume automatise toutes les étapes administratives pour que vous puissiez vous concentrer sur l'essentiel : vos patients.",
    icon: Clock,
    color: "orange",
    features: [],
    visual: (
      <div className="w-full py-8">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {[
            { num: 1, label: "Consultation", icon: Heart, color: "blue" },
            { num: 2, label: "Créer rapport", icon: FileText, color: "green" },
            { num: 3, label: "PDF généré", icon: Download, color: "purple" },
            { num: 4, label: "Email envoyé", icon: Send, color: "orange" },
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center">
              <div className="text-center">
                <div
                  className={`w-14 h-14 bg-${step.color}-100 dark:bg-${step.color}-900/30 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-${step.color}-600`}
                >
                  <step.icon className={`w-6 h-6 text-${step.color}-600`} />
                </div>
                <p className="text-xs font-semibold">{step.label}</p>
              </div>
              {idx < 3 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground mx-2 mt-[-20px]" />
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "dashboard",
    title: "Tableau de bord",
    subtitle: "Suivez votre activité en temps réel",
    description:
      "Visualisez vos statistiques, suivez vos performances et prenez de meilleures décisions grâce à des données claires et exploitables.",
    icon: BarChart3,
    color: "indigo",
    features: [
      {
        icon: BarChart3,
        text: "Statistiques détaillées",
        color: "text-indigo-600",
      },
      { icon: Clock, text: "Activité en temps réel", color: "text-indigo-600" },
      {
        icon: Sparkles,
        text: "Insights personnalisés",
        color: "text-indigo-600",
      },
    ],
    visual: (
      <div className="relative w-full h-48 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-12 w-16 h-32 bg-indigo-600 rounded" />
          <div className="absolute top-16 left-32 w-16 h-24 bg-indigo-500 rounded" />
          <div className="absolute top-12 right-32 w-16 h-28 bg-indigo-400 rounded" />
          <div className="absolute top-20 right-12 w-16 h-20 bg-indigo-300 rounded" />
        </div>
        <BarChart3 className="w-20 h-20 text-indigo-600 relative z-10" />
      </div>
    ),
  },
  {
    id: "ready",
    title: "Vous êtes prêt ! 🚀",
    subtitle: "Commencez à utiliser Biume",
    description:
      "Votre espace est configuré. Créez votre premier client, ajoutez vos patients et rédigez votre premier rapport professionnel.",
    icon: Rocket,
    color: "primary",
    features: [
      { icon: Check, text: "Organisation créée", color: "text-green-600" },
      { icon: Check, text: "Profil configuré", color: "text-green-600" },
      { icon: Check, text: "Prêt à démarrer", color: "text-green-600" },
    ],
  },
];

const OnboardingExplications = ({ open }: OnboardingExplicationsProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: activeOrg, refetch } = useActiveOrganization();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: completeOnboardingExplications,
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      console.error("Erreur lors de la complétion de l'onboarding");
      toast.error("Erreur lors de la complétion de l'onboarding");
    },
  });

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <Credenza open={open}>
      <CredenzaContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Explications</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col h-full">
          {/* Progress bar */}
          <div className="w-full h-1 bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentSlide + 1) / slides.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="inline-block"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                      <slide.icon className="w-8 h-8 text-primary" />
                    </div>
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground">
                      {slide.title}
                    </h2>
                    <p className="text-lg text-primary font-medium">
                      {slide.subtitle}
                    </p>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                  </div>
                </div>

                {/* Visual */}
                {slide.visual && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {slide.visual}
                  </motion.div>
                )}

                {/* Features */}
                {slide.features.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
                  >
                    {slide.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <feature.icon
                          className={`w-5 h-5 ${feature.color} flex-shrink-0`}
                        />
                        <span className="text-sm font-medium">
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-muted/30">
            <div className="flex items-center justify-between">
              {/* Slide indicators */}
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Aller à la slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentSlide === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>

                {isLastSlide ? (
                  <Button
                    size="sm"
                    onClick={async () =>
                      await mutateAsync(activeOrg?.id as string)
                    }
                    disabled={isPending}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Check className="w-4 h-4" />
                    {isPending ? "Chargement..." : "Commencer"}
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleNext} className="gap-2">
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
};

export default OnboardingExplications;
