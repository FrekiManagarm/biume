"use client";

import { CredenzaDescription, CredenzaTitle } from "@/components/ui/credenza";
import { useStepper } from "../hooks/useStepperAnimal";

import InformationsPetAllergiesStep from "./informations-pet-allergies-step";
import InformationsPetDeseasesStep from "./informations-pet-deseases-step";
import InformationsPetIntolerancesStep from "./informations-pet-intolerances-step";
import InformationsPetStep from "./informations-pet-step";
import PetCompleteStep from "../forms/pet-complete-step";
import StepIndicator from "@/components/onboarding/components/step-indicator";

interface CreatePetStepperProps {
  onComplete?: () => void;
}

const CreatePetStepper = ({ onComplete }: CreatePetStepperProps) => {
  const { flow, navigation: { next, prev, goTo, reset }, state, lifecycle, lookup } = useStepper();
  const currentIndex = lookup.getIndex(state.current.data.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center space-x-4">
        <StepIndicator
          currentStep={currentIndex + 1}
          totalSteps={state.all.length}
          isLast={state.isLast}
          size={80}
          strokeWidth={8}
        />
        <div className="space-y-1 flex flex-col">
          <CredenzaTitle>{state.current.data.title}</CredenzaTitle>
          <CredenzaDescription>{state.current.data.description}</CredenzaDescription>
        </div>
      </div>

      {flow.switch({
        pet: () => (
          <InformationsPetStep
            nextStep={next}
            petData={null}
            isUpdate={false}
          />
        ),
        petDeseases: () => (
          <InformationsPetDeseasesStep
            nextStep={next}
            previousStep={prev}
            isPending={false}
            petData={null}
            isUpdate={false}
          />
        ),
        petIntolerences: () => (
          <InformationsPetIntolerancesStep
            nextStep={next}
            previousStep={prev}
            isPending={false}
            petData={null}
            isUpdate={false}
          />
        ),
        petAllergies: () => (
          <InformationsPetAllergiesStep
            nextStep={next}
            previousStep={prev}
            isPending={false}
            petData={null}
            isUpdate={false}
          />
        ),
        complete: () => (
          <PetCompleteStep onComplete={onComplete} isUpdate={false} />
        ),
      })}
    </div>
  );
};

export default CreatePetStepper;
