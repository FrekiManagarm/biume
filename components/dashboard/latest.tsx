import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, User, PawPrint, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

type LatestReportsItem = {
  id: string;
  title: string;
  clientName: string;
  createdAt: string; // ISO string or formatted
  status: "brouillon" | "envoyé" | "signé";
};

type LatestPatientsItem = {
  id: string;
  name: string;
  species: string;
  ownerName: string;
  createdAt: string;
};

type LatestClientsItem = {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
};

export function LatestReports({ items }: { items: LatestReportsItem[] }) {
  const statusToVariant: Record<LatestReportsItem["status"], string> = {
    brouillon: "bg-amber-100 text-amber-700",
    envoyé: "bg-blue-100 text-blue-700",
    signé: "bg-emerald-100 text-emerald-700",
  };
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Derniers rapports</CardTitle>
          <CardDescription className="text-muted-foreground/90">
            Vos créations récentes
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/reports">Voir tout</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>Aucun rapport récent</EmptyTitle>
              <EmptyDescription>
                Créez votre premier rapport pour le voir ici.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/reports/${item.id}`}
            className="group block"
          >
            <div className="flex items-center justify-between gap-4 rounded-lg border p-2 transition-colors hover:bg-muted/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative bg-primary/10 text-primary flex size-9 items-center justify-center rounded-md">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium transition-colors group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground truncate text-sm">
                    {item.clientName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-md px-2 py-1 text-xs font-medium ${statusToVariant[item.status]}`}
                >
                  {item.status}
                </span>
                <span className="text-muted-foreground hidden text-sm tabular-nums sm:inline">
                  {item.createdAt}
                </span>
                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export function LatestPatients({ items }: { items: LatestPatientsItem[] }) {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Derniers patients</CardTitle>
          <CardDescription className="text-muted-foreground/90">
            Animaux récemment ajoutés
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/patients">Voir tout</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PawPrint />
              </EmptyMedia>
              <EmptyTitle>Aucun patient récent</EmptyTitle>
              <EmptyDescription>
                Ajoutez votre premier patient pour le voir ici.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/patients/${item.id}`}
            className="group block"
          >
            <div className="flex items-center justify-between gap-4 rounded-lg border p-2 transition-colors hover:bg-muted/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative bg-primary/10 text-primary flex size-9 items-center justify-center rounded-md">
                  <PawPrint className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium transition-colors group-hover:text-primary">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground truncate text-sm">
                    {item.species}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground hidden text-sm sm:inline">
                  {item.ownerName}
                </span>
                <span className="text-muted-foreground hidden text-sm tabular-nums md:inline">
                  {item.createdAt}
                </span>
                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export function LatestClients({ items }: { items: LatestClientsItem[] }) {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Derniers clients</CardTitle>
          <CardDescription className="text-muted-foreground/90">
            Clients récemment ajoutés
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/clients">Voir tout</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <User />
              </EmptyMedia>
              <EmptyTitle>Aucun client récent</EmptyTitle>
              <EmptyDescription>
                Ajoutez votre premier client pour le voir ici.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/clients/${item.id}`}
            className="group block"
          >
            <div className="flex items-center justify-between gap-4 rounded-lg border p-2 transition-colors hover:bg-muted/40">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar>
                  <AvatarImage alt={item.name} />
                  <AvatarFallback>
                    {item.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium transition-colors group-hover:text-primary">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground truncate text-sm">
                    {item.email || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground hidden text-sm tabular-nums sm:inline">
                  {item.createdAt}
                </span>
                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
