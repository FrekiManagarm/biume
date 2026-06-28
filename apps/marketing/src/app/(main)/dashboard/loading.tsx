import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PawPrint, FileText, Plus, Activity } from "lucide-react";

export default function DashboardHomeLoading() {
  return (
    <section className="space-y-6">
      {/* Header de chargement */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-1 h-4 w-80" />
        </div>
        <Button disabled size="default" className="gap-2">
          <Plus className="size-4" />
          Actions rapides
        </Button>
      </div>

      {/* Grille des métriques de chargement */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="h-full border-border/70 bg-card/80 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-1 h-4 w-40" />
              </div>
              <div className="text-muted-foreground">
                {index === 0 && <Users className="size-5" />}
                {index === 1 && <PawPrint className="size-5" />}
                {index === 2 && <FileText className="size-5" />}
                {index === 3 && <FileText className="size-5" />}
              </div>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-5 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Colonne principale */}
        <div className="space-y-4 lg:col-span-3">
          {/* Derniers rapports de chargement */}
          <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Derniers rapports</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Consultations et comptes rendus récents
                  </p>
                </div>
                <Button disabled variant="ghost" size="sm">
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-lg border bg-card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-1 gap-3">
                        <Skeleton className="size-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                          <Skeleton className="h-4 w-64" />
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="size-4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activité récente de chargement */}
          <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                Activité récente
              </CardTitle>
              <CardDescription>Dernières actions et événements</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="relative space-y-0 before:absolute before:left-[15px] before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-border/60">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="group relative flex gap-3 rounded-lg p-2"
                    >
                      <Skeleton className="z-10 mt-0.5 size-8 rounded-full" />
                      <div className="flex-1 space-y-0.5 py-0.5">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-64" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-4">
          {/* Répartition par espèce de chargement */}
          <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <PawPrint className="size-5 text-primary" />
                Distribution de la clientèle
              </CardTitle>
              <CardDescription>Répartition par espèce</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-[200px] w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total patients
                    </p>
                    <div className="mx-auto h-8 w-14">
                      <Skeleton className="h-8 w-14" />
                    </div>
                  </div>
                  <div className="space-y-1 text-center border-l">
                    <p className="text-sm font-medium text-muted-foreground">
                      Espèces
                    </p>
                    <div className="mx-auto h-8 w-10">
                      <Skeleton className="h-8 w-10" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
