"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronLeft, Users, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getAllClients } from "@/lib/api/actions/clients.action";
import { Pet } from "@/lib/schemas";
import { cn } from "@/lib/style";
import { Badge } from "@/components/ui/badge";

interface PatientOwnerStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
  patient?: Pet | null;
}

export function PatientOwnerStep({
  onNext,
  onBack,
  initialData,
  patient,
}: PatientOwnerStepProps) {
  const [ownerId, setOwnerId] = useState(
    initialData?.ownerId || patient?.ownerId || "",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getAllClients(),
  });

  // Filtrer les clients selon la recherche
  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.phone?.toLowerCase().includes(searchLower) ||
      client.city?.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Le propriétaire est optionnel, on peut continuer sans en sélectionner
    onNext({ ownerId: ownerId || undefined });
  };

  const selectedClient = clients.find((c) => c.id === ownerId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-base font-medium">Sélectionner un propriétaire</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Associez ce patient à un propriétaire existant ou continuez sans
          propriétaire (optionnel).
        </p>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un propriétaire par nom, email, téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Message si pas de propriétaires */}
        {clients.length === 0 && !isLoading && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              Aucun propriétaire dans votre base
            </p>
            <p className="text-xs text-muted-foreground">
              Vous pouvez créer un client depuis la page Clients
            </p>
          </div>
        )}

        {/* Liste des propriétaires */}
        {clients.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Propriétaires disponibles</Label>
              <Badge variant="secondary">
                {filteredClients.length} résultat
                {filteredClients.length > 1 ? "s" : ""}
              </Badge>
            </div>

            <RadioGroup
              value={ownerId}
              onValueChange={setOwnerId}
              className="space-y-2 max-h-[400px] overflow-y-auto"
            >
              {/* Option "Aucun propriétaire" */}
              <div
                className={cn(
                  "flex items-start space-x-3 space-y-0 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/50",
                  ownerId === ""
                    ? "border-primary bg-primary/5"
                    : "border-muted",
                )}
                onClick={() => setOwnerId("")}
              >
                <RadioGroupItem value="" id="no-owner" className="mt-0.5" />
                <div className="flex-1">
                  <Label
                    htmlFor="no-owner"
                    className="font-medium cursor-pointer"
                  >
                    Aucun propriétaire
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ce patient n'a pas encore de propriétaire assigné
                  </p>
                </div>
              </div>

              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={cn(
                    "flex items-start space-x-3 space-y-0 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/50",
                    ownerId === client.id
                      ? "border-primary bg-primary/5"
                      : "border-muted",
                  )}
                  onClick={() => setOwnerId(client.id)}
                >
                  <RadioGroupItem
                    value={client.id}
                    id={client.id}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={client.id}
                      className="font-medium cursor-pointer"
                    >
                      {client.name}
                    </Label>
                    <div className="space-y-1 mt-1">
                      {client.email && (
                        <p className="text-sm text-muted-foreground">
                          📧 {client.email}
                        </p>
                      )}
                      {client.phone && (
                        <p className="text-sm text-muted-foreground">
                          📱 {client.phone}
                        </p>
                      )}
                      {client.city && (
                        <p className="text-sm text-muted-foreground">
                          📍 {client.city}
                          {client.country && `, ${client.country}`}
                        </p>
                      )}
                      {client.pets && client.pets.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {client.pets.length} animal
                          {client.pets.length > 1 ? "aux" : ""} déjà enregistré
                          {client.pets.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {filteredClients.length === 0 && searchQuery && (
              <div className="text-center py-6 text-sm text-muted-foreground">
                Aucun propriétaire ne correspond à votre recherche
              </div>
            )}
          </div>
        )}

        {/* Propriétaire sélectionné */}
        {selectedClient && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Propriétaire sélectionné :</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{selectedClient.name}</p>
                {selectedClient.email && (
                  <p className="text-sm text-muted-foreground">
                    {selectedClient.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button type="submit">
          Suivant
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

