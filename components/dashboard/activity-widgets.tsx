"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Activity, PawPrint } from "lucide-react";
import { cn } from "@/lib/style";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Types pour l'activité récente
type ActivityItem = {
  id: string;
  type: "appointment" | "report" | "payment" | "new_patient";
  title: string;
  description: string;
  timestamp: string; // format: "Il y a 2h"
  icon: React.ReactNode;
  color: string;
};

// Types pour les stats de rendez-vous
type AppointmentStatsItem = {
  status: string;
  count: number;
  percentage: number;
  color: string;
};

/**
 * Activité récente - timeline des dernières actions
 */
export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Activity className="size-5 text-primary" />
          Activité récente
        </CardTitle>
        <CardDescription>Dernières actions et événements</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <div className="rounded-full bg-muted p-3">
              <Activity className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">Aucune activité récente</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Les activités apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="relative space-y-0 before:absolute before:left-[15px] before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-border/60">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="group relative flex gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
                >
                  <div
                    className={cn(
                      "z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-background shadow-sm transition-transform group-hover:scale-110",
                      item.color,
                    )}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 space-y-0.5 py-0.5">
                    <p className="text-sm font-semibold leading-tight">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {item.description}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                      <Clock className="size-3" />
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Répartition de la clientèle par race d'animal
 */
export function ClienteleBySpecies({
  items,
}: {
  items: AppointmentStatsItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  // Configuration des couleurs pour le graphique
  const chartConfig = {
    count: {
      label: "Patients",
    },
    chiens: {
      label: "Chiens",
      color: "hsl(217, 91%, 60%)",
    },
    chats: {
      label: "Chats",
      color: "hsl(271, 91%, 65%)",
    },
    chevaux: {
      label: "Chevaux",
      color: "hsl(32, 95%, 44%)",
    },
    autres: {
      label: "Autres",
      color: "hsl(142, 71%, 45%)",
    },
  } satisfies ChartConfig;

  // Transformer les données pour Recharts
  const chartData = items.map((item) => ({
    species: item.status,
    count: item.count,
    fill: `var(--color-${item.status.toLowerCase()})`,
  }));
  const maxCount = Math.max(0, ...items.map((item) => item.count));
  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <PawPrint className="size-5 text-primary" />
          Distribution de la clientèle
        </CardTitle>
        <CardDescription>Répartition par espèce</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <div className="rounded-full bg-muted p-3">
              <PawPrint className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">Aucun patient</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Les statistiques apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Graphique en barres verticales */}
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="species"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  dataKey="count"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="text-xs"
                  allowDecimals={false}
                  ticks={yTicks}
                  domain={[0, maxCount]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>

            {/* Statistiques résumées */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Total patients
                </p>
                <p className="text-3xl font-bold text-foreground">{total}</p>
              </div>
              <div className="space-y-1 text-center border-l">
                <p className="text-sm font-medium text-muted-foreground">
                  Espèces
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {items.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ClienteleBySpeciesLoading() {
  return (
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
  );
}
