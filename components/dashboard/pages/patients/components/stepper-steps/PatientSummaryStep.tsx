"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Check, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pet, CreatePetSchema } from "@/lib/schemas";
import { createPet, updatePet } from "@/lib/api/actions/pets.action";
import { getAllClients } from "@/lib/api/actions/clients.action";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";

interface PatientSummaryStepProps {
  data: any;
  onBack: () => void;
  onComplete: () => void;
  mode: "create" | "edit";
  patient?: Pet | null;
}

export function PatientSummaryStep({
  data,
  onBack,
  onComplete,
  mode,
  patient,
}: PatientSummaryStepProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer les clients pour afficher le nom du propriétaire
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getAllClients(),
  });

  const selectedOwner = data.ownerId
    ? clients.find((c) => c.id === data.ownerId)
    : null;

  const { mutateAsync: createPatientMutation } = useMutation({
    mutationFn: createPet,
    onSuccess: () => {
      toast.success("Le patient a été créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      onComplete();
    },
    onError: (error: Error) => {
      toast.error(
        `Une erreur est survenue lors de la création du patient: ${error.message}`,
      );
    },
  });

  const { mutateAsync: updatePatientMutation } = useMutation({
    mutationFn: (data: {
      petData: z.infer<typeof CreatePetSchema>;
      id: string;
    }) => updatePet(data.petData, data.id),
    onSuccess: () => {
      toast.success("Le patient a été modifié avec succès");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      onComplete();
    },
    onError: (error: Error) => {
      toast.error(
        `Une erreur est survenue lors de la modification du patient: ${error.message}`,
      );
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const patientData: z.infer<typeof CreatePetSchema> = {
      name: data.name,
      type: data.type,
      gender: data.gender,
      breed: data.breed,
      image: data.image,
      birthDate: data.birthDate,
      description: data.description,
      weight: data.weight,
      height: data.height,
      chippedNumber: data.chippedNumber || undefined,
      ownerId: data.ownerId || undefined,
      deseases: data.deseases?.length > 0 ? data.deseases : undefined,
      allergies: data.allergies?.length > 0 ? data.allergies : undefined,
      intolerences:
        data.intolerences?.length > 0 ? data.intolerences : undefined,
    };

    try {
      if (mode === "edit" && patient) {
        await updatePatientMutation({ petData: patientData, id: patient.id });
      } else {
        await createPatientMutation(patientData);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Vérifiez les informations</h3>
        <p className="text-sm text-muted-foreground">
          Assurez-vous que toutes les informations sont correctes avant de
          valider
        </p>
      </div>

      <Separator />

      {/* Photo */}
      {data.image && (
        <div>
          <h4 className="text-sm font-medium mb-2">Photo</h4>
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-primary/20">
            <Image
              src={data.image}
              alt={data.name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Informations générales */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Informations générales</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Nom :</span>
            <p className="font-medium">{data.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Race :</span>
            <p className="font-medium">{data.breed}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Sexe :</span>
            <p className="font-medium">
              {data.gender === "Male" ? "Mâle" : "Femelle"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Date de naissance :</span>
            <p className="font-medium">
              {new Date(data.birthDate).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Poids :</span>
            <p className="font-medium">{data.weight} kg</p>
          </div>
          <div>
            <span className="text-muted-foreground">Taille :</span>
            <p className="font-medium">{data.height} cm</p>
          </div>
          {data.chippedNumber > 0 && (
            <div>
              <span className="text-muted-foreground">N° identification :</span>
              <p className="font-medium">{data.chippedNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Description</h4>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>
      )}

      {/* Propriétaire */}
      {selectedOwner && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Propriétaire</h4>
            <div className="bg-accent/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedOwner.name}</p>
                  {selectedOwner.email && (
                    <p className="text-sm text-muted-foreground">
                      {selectedOwner.email}
                    </p>
                  )}
                  {selectedOwner.phone && (
                    <p className="text-sm text-muted-foreground">
                      {selectedOwner.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Informations médicales */}
      {(data.deseases?.length > 0 ||
        data.allergies?.length > 0 ||
        data.intolerences?.length > 0) && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Informations médicales</h4>

            {data.deseases?.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Maladies :</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.deseases.map((desease: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {desease}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.allergies?.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Allergies :
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.allergies.map((allergy: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.intolerences?.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Intolérances :
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.intolerences.map(
                    (intolerence: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {intolerence}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Création..." : "Modification..."}
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {mode === "create" ? "Créer le patient" : "Modifier le patient"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

