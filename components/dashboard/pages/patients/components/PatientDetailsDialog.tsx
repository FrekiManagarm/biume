"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pet } from "@/lib/schemas";
import {
  PawPrint,
  User,
  Scale,
  Ruler,
  Calendar,
  FileText,
  Heart,
  AlertCircle,
} from "lucide-react";

interface PatientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Pet | null;
}

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const calculateAge = (birthDate: Date | null | undefined) => {
  if (!birthDate) return "—";
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1;
  }
  return age;
};

export function PatientDetailsDialog({
  open,
  onOpenChange,
  patient,
}: PatientDetailsDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <VisuallyHidden>
          <DialogTitle>Détails du patient</DialogTitle>
        </VisuallyHidden>

        <div className="space-y-6">
          {/* En-tête */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Détails du patient
            </h2>
            <p className="text-sm text-muted-foreground">
              Informations complètes du patient animal
            </p>
          </div>

          {/* Informations principales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PawPrint className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Informations principales</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">Nom</p>
                <p className="font-medium">{patient.name || "—"}</p>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">Race</p>
                <p className="font-medium">{patient.breed || "—"}</p>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">Sexe</p>
                <p className="font-medium">
                  {patient.gender === "Male" ? "Mâle" : "Femelle"}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">Âge</p>
                <p className="font-medium">
                  {calculateAge(patient.birthDate)} an
                  {calculateAge(patient.birthDate) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Propriétaire */}
          {patient.owner && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Propriétaire</h3>
                </div>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="font-medium">{patient.owner.name}</p>
                  {patient.owner.email && (
                    <p className="text-sm text-muted-foreground">
                      {patient.owner.email}
                    </p>
                  )}
                  {patient.owner.phone && (
                    <p className="text-sm text-muted-foreground">
                      {patient.owner.phone}
                    </p>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Mesures */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Mesures</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Poids</p>
                </div>
                <p className="font-medium">{patient.weight || 0} kg</p>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Taille</p>
                </div>
                <p className="font-medium">{patient.height || 0} cm</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations complémentaires */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">
                Informations complémentaires
              </h3>
            </div>

            {patient.description && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm">{patient.description}</p>
              </div>
            )}

            {patient.chippedNumber && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Numéro de puce
                </p>
                <p className="font-medium font-mono">{patient.chippedNumber}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Maladies</p>
                </div>
                {patient.deseases && patient.deseases.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {patient.deseases.map((disease, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {disease}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune</p>
                )}
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Allergies</p>
                </div>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {patient.allergies.map((allergy, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-yellow-50 border-yellow-200"
                      >
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune</p>
                )}
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Intolérances</p>
                </div>
                {patient.intolerences && patient.intolerences.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {patient.intolerences.map((intolerence, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-orange-50 border-orange-200"
                      >
                        {intolerence}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Informations système</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Date de naissance
                </p>
                <p className="font-medium">{formatDate(patient.birthDate)}</p>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">Créé le</p>
                <p className="font-medium">{formatDate(patient.createdAt)}</p>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Dernière modification
                </p>
                <p className="font-medium">{formatDate(patient.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
