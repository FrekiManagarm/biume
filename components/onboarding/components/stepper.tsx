"use client";

import {
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { useStepper, utils } from "../hooks/useStepper";
import IntroStep from "../pro/intro-step";
import ProInformationsStep from "../pro/informations-step";
import StepIndicator from "./step-indicator";
import React from "react";

const Stepper = () => {
  const { next, prev, current, all, isLast, switch: switchStep } = useStepper();
  const currentStep = utils.getIndex(current.id);

  return (
    <CredenzaContent className="min-w-4xl mx-auto w-full h-[700px] flex flex-col">
      <CredenzaHeader className="flex flex-row items-center space-x-4">
        <StepIndicator
          currentStep={currentStep + 1}
          totalSteps={all.length}
          isLast={isLast}
        />
        <div className="space-y-1 flex flex-col">
          <CredenzaTitle className="text-xl font-bold">
            {current.title}
          </CredenzaTitle>
          <CredenzaDescription className="text-muted-foreground text-md">
            {current.description}
          </CredenzaDescription>
        </div>
      </CredenzaHeader>

      <div className="flex-1 overflow-hidden">
        {switchStep({
          start: () => <IntroStep nextStep={next} />,
          informations: () => (
            <ProInformationsStep nextStep={next} previousStep={prev} />
          ),
        })}
      </div>
    </CredenzaContent>
  );
};

export default Stepper;
