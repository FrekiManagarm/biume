import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="min-h-screen w-full flex items-center py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2 rounded-full bg-linear-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-lg shadow-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium">
              L'IA au service de la santé animale
            </span>
          </div>

          <div className="space-y-8 md:space-y-6 max-w-5xl mx-auto">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
              <span className="block text-foreground">
                Simplifiez votre pratique
              </span>
              <span className="block bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                avec intelligence
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-4">
              Une application santé animale qui s'adapte à votre pratique et
              libère votre temps pour l'essentiel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center max-w-lg mx-auto px-4">
            <Button asChild size="lg" variant="default">
              <Link
                href="https://cal.com/mathieu-chambaud-biume"
                target="_blank"
                rel="noopener noreferrer"
              >
                Demander une démo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="#features">En savoir plus</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Gagnez jusqu'à 2h par jour</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>100% sécurisé et conforme RGPD</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Essai gratuit 15 jours</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
