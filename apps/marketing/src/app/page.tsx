import { ArrowRight, FileText, PawPrint } from "lucide-react";
import { Badge } from "@biume/ui/components/badge";
import { Button } from "@biume/ui/components/button";

export default function Page() {
  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <section className="relative mx-auto grid min-h-dvh w-full max-w-7xl items-center gap-12 px-4 py-28 md:grid-cols-[0.95fr_1.05fr] md:px-6">
        <div className="max-w-2xl">
          <Badge className="mb-6 gap-2" variant="default">
            <PawPrint className="size-3.5" />
            Biume v2
          </Badge>
          <h1 className="text-4xl font-semibold leading-none tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Le compte rendu anatomique que vous etes fier d'envoyer.
          </h1>
          <p className="mt-6 max-w-[58ch] text-base leading-7 text-muted-foreground md:text-lg">
            Transformez vos consultations animales en rapports visuels, clairs et professionnels pour aider les proprietaires a comprendre votre travail.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              Transformer un ancien compte rendu
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline">
              Voir le produit
            </Button>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-border bg-card p-4 shadow-[0_40px_100px_-55px_rgba(15,23,42,0.58)]">
          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Rapport anatomique
                </p>
                <h2 className="mt-1 text-xl font-semibold">Nala - suivi cervical</h2>
              </div>
              <FileText className="size-5 text-primary" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="aspect-[4/5] rounded-2xl border border-primary/20 bg-primary/10" />
              <div className="space-y-3">
                <div className="h-3 w-4/5 rounded-full bg-muted" />
                <div className="h-3 w-full rounded-full bg-muted" />
                <div className="h-3 w-3/5 rounded-full bg-muted" />
                <div className="mt-5 rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-sm leading-6">
                  Version proprietaire claire, rassurante et prete a envoyer.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
