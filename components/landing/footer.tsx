import { PawPrint } from "lucide-react";
import Link from "next/link";

const LandingFooter = () => {
  return (
    <footer className="border-t border-border/40 bg-muted/10 backdrop-blur-sm py-16">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <PawPrint fill="white" className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Biume</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              La solution complète pour les thérapeutes animaliers. 
              Gagnez du temps sur vos rapports et concentrez-vous sur le soin.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">Produit</h4>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Fonctionnalités</Link></li>
              <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tarifs</Link></li>
              <li><Link href="/demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">Réserver une démo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">Légal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Confidentialité</Link></li>
              <li><Link href="/cgu" className="text-sm text-muted-foreground hover:text-primary transition-colors">CGU</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Biume. Tous droits réservés.</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
             <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
             Hébergé en France (RGPD)
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

