import { PawPrint } from "lucide-react";
import Link from "next/link";

const LandingFooter = () => {
  return (
    <footer className="border-t border-border py-12 bg-muted/20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <PawPrint fill="white" className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">Biume</span>
                <span className="text-xs text-muted-foreground">
                  Thérapeutes animaliers
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              La solution complète pour les professionnels de la santé animale
              manuelle. Gagnez du temps, améliorez votre organisation et
              développez votre activité.
            </p>
          </div>

          {/* Navigation rapide */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Navigation</h4>
            <div className="space-y-2">
              <a
                href="#reports"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Les rapports
              </a>
              <a
                href="#features"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Fonctionnalités
              </a>
              <a
                href="#pricing"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Tarifs
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Informations</h4>
            <div className="space-y-2">
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                À propos
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/cgu"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                CGU
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Biume. Tous droits réservés.</p>
            <p className="text-xs">
              🔒 Conforme RGPD • Hébergement sécurisé en France
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
