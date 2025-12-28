"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  PawPrint,
} from "lucide-react";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PetSheet } from "./PetSheet";
import { ClientDialogProps } from "./types";
import { createClient } from "@/lib/api/actions/clients.action";
import { CreatePetSchema, Pet } from "@/lib/schemas";
import { z } from "zod";
import { PetList } from "./PetList";

export function ClientDialog({ open, onOpenChange }: ClientDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [petSheetOpen, setPetSheetOpen] = useState(false);
  const [editingPetIndex, setEditingPetIndex] = useState<number | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const handleCancel = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setCity("");
    setCountry("");
    setPets([]);
    onOpenChange(false);
  };

  const { mutateAsync: createClientMutation } = useMutation({
    mutationFn: createClient,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      toast.success("Le client a été créé avec succès");
      handleCancel();
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la création du client");
      setIsSubmitting(false);
    },
  });

  const onSubmit = async () => {
    const client = { name, email, phoneNumber, city, country, pets };
    await createClientMutation(client);
  };

  const handleAddPet = useCallback(() => {
    setEditingPetIndex(null);
    setPetSheetOpen(true);
  }, []);

  const handleEditPet = useCallback((index: number) => {
    setEditingPetIndex(index);
    setPetSheetOpen(true);
  }, []);

  const handleSavePet = (
    petData: z.infer<typeof CreatePetSchema>,
    index?: number,
  ) => {
    if (index !== undefined) {
      setPets((prev) =>
        prev.map((pet, i) => (i === index ? (petData as Pet) : pet)),
      );
    } else {
      setPets((prev) => [...prev, petData as Pet]);
    }
  };

  return (
    <>
      <Credenza open={open} onOpenChange={onOpenChange}>
        <CredenzaContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <CredenzaHeader className="p-6 pb-2">
            <CredenzaTitle>Créer un nouveau client</CredenzaTitle>
            <CredenzaDescription>
              Ajoutez un nouveau client à votre tableau de bord.
            </CredenzaDescription>
          </CredenzaHeader>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="px-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="john@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="+33 6 12 34 56 78"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ville
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Paris"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pays</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="France"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* Pets Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-medium">
                      Animaux ({pets.length})
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddPet}
                    className="h-8"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {pets.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
                        Aucun animal ajouté pour ce client
                      </div>
                    ) : (
                      <PetList
                        fields={pets}
                        onEdit={handleEditPet}
                        onDelete={() => {}}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center gap-3 p-4 bg-muted/20 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer le client"}
              </Button>
            </div>
          </form>
        </CredenzaContent>
      </Credenza>
      <PetSheet
        open={petSheetOpen}
        onOpenChange={setPetSheetOpen}
        petIndex={editingPetIndex}
        onSave={handleSavePet}
        defaultValues={
          editingPetIndex !== null ? pets[editingPetIndex] : undefined
        }
        isEditing={editingPetIndex !== null}
      />
    </>
  );
}
