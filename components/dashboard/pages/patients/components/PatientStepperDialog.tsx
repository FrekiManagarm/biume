"use client";

import { useState } from "react";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Pet } from "@/lib/schemas";
import StepIndicator from "@/components/onboarding/components/step-indicator";

// Import des étapes
import { PatientBasicInfoStep } from "./stepper-steps/PatientBasicInfoStep";
import { PatientOwnerStep } from "./stepper-steps/PatientOwnerStep";
import { PatientMedicalInfoStep } from "./stepper-steps/PatientMedicalInfoStep";
import { PatientSummaryStep } from "./stepper-steps/PatientSummaryStep";

interface PatientStepperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  patient?: Pet | null;
}

const STEPS = [
  {
    id: 1,
    title: "Informations de base",
    description: "Nom, type, date de naissance et photo",
  },
  {
    id: 2,
    title: "Propriétaire",
    description: "Sélectionner le propriétaire du patient",
  },
  {
    id: 3,
    title: "Informations médicales",
    description: "Maladies, allergies et intolérances",
  },
  {
    id: 4,
    title: "Récapitulatif",
    description: "Vérification et validation",
  },
];

export function PatientStepperDialog({
  open,
  onOpenChange,
  mode,
  patient,
}: PatientStepperDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({});
    onOpenChange(false);
  };

  const currentStepData = STEPS.find((s) => s.id === currentStep);

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="sm:max-w-[900px] p-0 overflow-hidden max-h-[90vh]">
        <CredenzaHeader className="p-4">
          <div className="flex items-center gap-4">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={STEPS.length}
              isLast={currentStep === STEPS.length}
              size={80}
              strokeWidth={6}
            />
            <div>
              <CredenzaTitle>
                {mode === "create"
                  ? "Créer un nouveau patient"
                  : "Modifier le patient"}
              </CredenzaTitle>
              <CredenzaDescription>
                <span className="font-medium">{currentStepData?.title}</span> —{" "}
                {currentStepData?.description}
              </CredenzaDescription>
            </div>
          </div>
        </CredenzaHeader>

        <div className="px-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {currentStep === 1 && (
            <PatientBasicInfoStep
              onNext={handleNext}
              initialData={formData}
              patient={patient}
            />
          )}
          {currentStep === 2 && (
            <PatientOwnerStep
              onNext={handleNext}
              onBack={handleBack}
              initialData={formData}
              patient={patient}
            />
          )}
          {currentStep === 3 && (
            <PatientMedicalInfoStep
              onNext={handleNext}
              onBack={handleBack}
              initialData={formData}
              patient={patient}
            />
          )}
          {currentStep === 4 && (
            <PatientSummaryStep
              data={formData}
              onBack={handleBack}
              onComplete={handleClose}
              mode={mode}
              patient={patient}
            />
          )}
        </div>

        <div className="flex justify-between items-center gap-3 p-4 bg-muted/20 border-t">
          <div className="text-sm text-muted-foreground">
            Étape {currentStep} sur {STEPS.length}
          </div>
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                size="sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              size="sm"
            >
              Annuler
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
