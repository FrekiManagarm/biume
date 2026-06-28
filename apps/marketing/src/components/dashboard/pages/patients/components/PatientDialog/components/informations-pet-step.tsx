"use client";

import InformationsPetForm from "../forms/informations-pet-form";
import { Pet } from "@/lib/schemas";

interface InformationsPetStepProps {
  nextStep: () => void;
  petData?: Pet | null;
  isUpdate?: boolean;
}

const InformationsPetStep = ({
  nextStep,
  petData,
  isUpdate = false,
}: InformationsPetStepProps) => {
  return (
    <InformationsPetForm
      nextStep={nextStep}
      petData={petData}
      isUpdate={isUpdate}
    />
  );
};

export default InformationsPetStep;
