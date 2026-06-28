import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@biume/ui/components/button";

export const Route = createFileRoute("/")({
  component: AppHome,
});

function AppHome() {
  return (
    <main className="min-h-dvh bg-background px-4 py-10 text-foreground md:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Biume product app
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-none tracking-tight md:text-6xl">
              Le rapport devient le centre du cabinet.
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-7 text-muted-foreground">
              Cette app TanStack Start accueillera les rapports, patients,
              clients, agenda et reglages autour du compte rendu anatomique.
            </p>
            <Button className="mt-8" size="lg">
              Preparer le premier rapport
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-5">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="font-semibold">Rapport en cours</p>
                <p className="text-sm text-muted-foreground">
                  Structure app prete pour la migration.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-3 w-full rounded-full bg-muted" />
              <div className="h-3 w-4/5 rounded-full bg-muted" />
              <div className="h-3 w-2/3 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
