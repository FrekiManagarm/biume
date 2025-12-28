import {
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  const benefits = [
    "Essai gratuit de 15 jours",
    "Formation personnalisée incluse",
    "Support dédié 7j/7",
    "Migration de vos données offerte",
  ];

  return (
    <section id="cta" className="py-16 md:py-32 relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto max-w-6xl">
        {/* Header centré */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-muted/50 border border-border shadow-lg">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Prêt à démarrer ?</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Transformez votre activité{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              dès aujourd&apos;hui
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Rejoignez les centaines de professionnels qui font confiance à Biume
            pour gérer leur activité au quotidien
          </p>
        </div>

        {/* CTA Card principale */}
        <div className="relative rounded-2xl md:rounded-3xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl p-6 md:p-10 lg:p-12 overflow-hidden">
          {/* Lignes de gradient */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-primary/5 to-transparent pointer-events-none"></div>

          {/* Background subtil pour meilleure visibilité */}
          <div className="absolute inset-0 bg-linear-to-br from-muted/30 to-background/50 -z-10"></div>

          <div className="relative grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Contenu gauche */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Offre de lancement
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Lancez-vous sans risque
              </h3>

              <p className="text-base md:text-lg text-muted-foreground mb-6">
                Testez toutes les fonctionnalités pendant 15 jours, sans carte
                bancaire. Notre équipe vous accompagne à chaque étape.
              </p>

              {/* Liste des avantages */}
              <div className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm md:text-base">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button asChild variant="default" size="lg">
                  <Link href="/sign-up">Commencer gratuitement</Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <Link
                    href="https://cal.com/mathieu-chambaud-biume"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demander une démo
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Contenu droite - Carte de témoignage */}
            <div className="relative">
              <div className="relative rounded-2xl border border-border bg-muted/30 backdrop-blur-xl shadow-lg p-6 md:p-8">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>

                {/* Étoiles */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-base md:text-lg mb-6 italic">
                  &quot;Biume a révolutionné ma pratique. Je gagne 2 heures par
                  jour sur l&apos;administratif et mes clients aiment mes
                  rapports détaillés.&quot;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-lg font-bold">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold">Marie C.</p>
                    <p className="text-sm text-muted-foreground">
                      Ostéopathe équin, Paris
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge satisfaction */}
              <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full bg-card border border-border backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold">98% satisfait</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
