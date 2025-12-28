"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

interface BlogCtaProps {
  variant?: "default" | "minimal" | "gradient";
  title?: string;
  description?: string;
  showFeatures?: boolean;
}

export function BlogCta({
  variant = "default",
  title = "Prêt à transformer votre pratique ?",
  description = "Rejoignez plus de 500 thérapeutes animaliers qui ont déjà fait le choix de l'efficacité avec Biume.",
  showFeatures = true,
}: BlogCtaProps) {
  const features = [
    "Essai gratuit de 15 jours",
    "Sans engagement",
    "Support dédié",
  ];

  if (variant === "minimal") {
    return (
      <div className="not-prose my-12 rounded-2xl border border-border/50 bg-linear-to-br from-background to-muted/30 p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          {description}
        </p>
        <Button size="lg" className="rounded-full" asChild>
          <Link href="/sign-up">
            Commencer gratuitement
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className="not-prose my-12 relative overflow-hidden rounded-3xl">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-purple-500/10 to-secondary/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

        <div className="relative p-8 md:p-12">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-sm font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Augmentez votre productivité de 40%</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold">{title}</h3>
            <p className="text-lg text-muted-foreground">{description}</p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
              <Button
                size="lg"
                className="rounded-full shadow-lg w-full sm:w-auto"
                asChild
              >
                <Link href="/sign-up">
                  Essayer Biume gratuitement
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full bg-background/50 backdrop-blur-sm w-full sm:w-auto"
                asChild
              >
                <Link href="/demo">Voir la démo</Link>
              </Button>
            </div>

            {showFeatures && (
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant with animation
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="not-prose my-16 relative overflow-hidden rounded-3xl border border-border/50 bg-background shadow-xl"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative p-8 md:p-12 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              Pour les professionnels
            </div>

            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              {title}
            </h3>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>

            {showFeatures && (
              <div className="space-y-3 pt-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                className="rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
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
                className="rounded-full"
                asChild
              >
                <Link
                  href="https://cal.com/mathieu-chambaud-biume"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Parler à un expert
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square rounded-2xl bg-linear-to-br from-primary/10 via-purple-500/5 to-secondary/10 backdrop-blur-sm border border-border/50 p-8 overflow-hidden">
              {/* Abstract representation of the app features */}
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted/50 rounded w-3/4" />
                    <div className="h-2 bg-muted/30 rounded w-1/2" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted/50 rounded w-2/3" />
                    <div className="h-2 bg-muted/30 rounded w-3/4" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted/50 rounded w-4/5" />
                    <div className="h-2 bg-muted/30 rounded w-2/3" />
                  </div>
                </div>
              </div>

              {/* Stats Badge */}
              <div className="absolute bottom-8 right-8 bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/50">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">
                  Professionnels
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-t from-background to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
