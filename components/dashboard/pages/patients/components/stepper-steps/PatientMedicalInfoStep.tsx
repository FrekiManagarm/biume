"use client";

import { useState } from "react";
import { AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pet } from "@/lib/schemas";
import { X } from "lucide-react";

interface PatientMedicalInfoStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
  patient?: Pet | null;
}

export function PatientMedicalInfoStep({
  onNext,
  onBack,
  initialData,
  patient,
}: PatientMedicalInfoStepProps) {
  const [deseases, setDeseases] = useState<string[]>(
    initialData?.deseases || patient?.deseases || [],
  );
  const [allergies, setAllergies] = useState<string[]>(
    initialData?.allergies || patient?.allergies || [],
  );
  const [intolerences, setIntolerences] = useState<string[]>(
    initialData?.intolerences || patient?.intolerences || [],
  );

  const [currentDesease, setCurrentDesease] = useState("");
  const [currentAllergy, setCurrentAllergy] = useState("");
  const [currentIntolerence, setCurrentIntolerence] = useState("");

  const handleAddDesease = () => {
    if (currentDesease.trim()) {
      setDeseases([...deseases, currentDesease.trim()]);
      setCurrentDesease("");
    }
  };

  const handleAddAllergy = () => {
    if (currentAllergy.trim()) {
      setAllergies([...allergies, currentAllergy.trim()]);
      setCurrentAllergy("");
    }
  };

  const handleAddIntolerence = () => {
    if (currentIntolerence.trim()) {
      setIntolerences([...intolerences, currentIntolerence.trim()]);
      setCurrentIntolerence("");
    }
  };

  const handleRemoveDesease = (index: number) => {
    setDeseases(deseases.filter((_, i) => i !== index));
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleRemoveIntolerence = (index: number) => {
    setIntolerences(intolerences.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      deseases,
      allergies,
      intolerences,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          <h3 className="text-base font-medium">
            Informations médicales (optionnel)
          </h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Ces informations nous aideront à mieux prendre soin de votre animal.
          Toutes ces informations sont optionnelles.
        </p>

        {/* Maladies */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="deseases">Maladies</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Ajoutez les maladies diagnostiquées
            </p>
            <div className="flex gap-2">
              <Input
                id="deseases"
                placeholder="Ex: Arthrose, Diabète..."
                value={currentDesease}
                onChange={(e) => setCurrentDesease(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddDesease();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddDesease}
                variant="outline"
                size="sm"
              >
                Ajouter
              </Button>
            </div>
            {deseases.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {deseases.map((desease, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-2 py-1.5"
                  >
                    {desease}
                    <button
                      type="button"
                      onClick={() => handleRemoveDesease(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="allergies">Allergies</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Ajoutez les allergies connues
            </p>
            <div className="flex gap-2">
              <Input
                id="allergies"
                placeholder="Ex: Pollen, Poulet..."
                value={currentAllergy}
                onChange={(e) => setCurrentAllergy(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAllergy();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddAllergy}
                variant="outline"
                size="sm"
              >
                Ajouter
              </Button>
            </div>
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {allergies.map((allergy, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-2 py-1.5"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Intolérances */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="intolerences">Intolérances</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Ajoutez les intolérances alimentaires
            </p>
            <div className="flex gap-2">
              <Input
                id="intolerences"
                placeholder="Ex: Lactose, Blé..."
                value={currentIntolerence}
                onChange={(e) => setCurrentIntolerence(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIntolerence();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddIntolerence}
                variant="outline"
                size="sm"
              >
                Ajouter
              </Button>
            </div>
            {intolerences.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {intolerences.map((intolerence, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-2 py-1.5"
                  >
                    {intolerence}
                    <button
                      type="button"
                      onClick={() => handleRemoveIntolerence(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
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

