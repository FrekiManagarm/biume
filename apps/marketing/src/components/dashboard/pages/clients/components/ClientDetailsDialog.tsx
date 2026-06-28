"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/lib/schemas";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  PawPrint,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function ClientDetailsDialog({
  open,
  onOpenChange,
  client,
}: ClientDetailsDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Détails du client - {client.name}</DialogTitle>
        </VisuallyHidden>

        {/* Header avec Background */}
        <div className="relative w-full h-32 bg-linear-to-r from-primary/10 to-primary/5 border-b">
          <div className="absolute -bottom-12 left-8">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={client.image || undefined} alt={client.name || ""} />
              <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                {client.name ? getInitials(client.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border-0">
              <Calendar className="h-3 w-3 mr-1.5 opacity-70" />
              Depuis le {formatDate(client.createdAt)}
            </Badge>
          </div>
        </div>

        {/* Contenu Principal */}
        <div className="pt-16 px-8 pb-8 space-y-8">
          {/* En-tête Profil */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {client.name || "Client sans nom"}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  ID: {client.id.slice(0, 8)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  Mis à jour le {formatDate(client.updatedAt)}
                </span>
              </div>
            </div>
            {/* Actions (placeholder pour futures features) */}
            {/* <Button variant="outline" size="sm">Modifier</Button> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colonne Gauche : Infos Contact */}
            <div className="md:col-span-1 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Coordonnées
                </h3>

                <div className="space-y-3">
                  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                    <div className="space-y-1 overflow-hidden">
                      <p className="text-xs font-medium text-muted-foreground">Email</p>
                      {client.email ? (
                        <Link
                          href={`mailto:${client.email}`}
                          className="text-sm font-medium hover:underline truncate block"
                          title={client.email}
                        >
                          {client.email}
                        </Link>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Non renseigné</p>
                      )}
                    </div>
                  </div>

                  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                      {client.phone ? (
                        <Link
                          href={`tel:${client.phone}`}
                          className="text-sm font-medium hover:underline block"
                        >
                          {client.phone}
                        </Link>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Non renseigné</p>
                      )}
                    </div>
                  </div>

                  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Adresse</p>
                      {(client.address || client.city || client.zip) ? (
                        <div className="text-sm font-medium leading-relaxed">
                          {client.address && <p>{client.address}</p>}
                          <p>
                            {[client.zip, client.city, client.state, client.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Non renseignée</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Patients */}
            <div className="md:col-span-1 space-y-6 w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <PawPrint className="h-4 w-4 text-primary" />
                  Patients
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 rounded-full text-[10px]">
                    {client.pets?.length || 0}
                  </Badge>
                </h3>
              </div>

              {client.pets && client.pets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {client.pets.map((pet) => (
                    <Card key={pet.id} className="overflow-hidden hover:shadow-md transition-all duration-200 border bg-card/50 hover:bg-card">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-lg border bg-muted/30">
                            <AvatarImage src={pet.image || undefined} alt={pet.name} />
                            <AvatarFallback className="rounded-lg text-xs bg-primary/5 text-primary">
                              {pet.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm truncate">{pet.name}</p>
                              {pet.gender && (
                                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  {pet.gender === 'Male' ? 'M' : 'F'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {pet.animal?.name || "Animal inconnu"}
                              {pet.breed ? ` • ${pet.breed}` : ""}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg border-dashed bg-muted/20">
                  <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <PawPrint className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Aucun patient</p>
                  <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
                    Ce client n'a pas encore d'animaux enregistrés.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
