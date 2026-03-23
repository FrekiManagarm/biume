"use client";

import {
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { useStepper } from "../hooks/useStepper";
import IntroStep from "../pro/intro-step";
import ProInformationsStep from "../pro/informations-step";
import StepIndicator from "./step-indicator";

const Stepper = () => {
  const { flow, navigation: { next, prev, goTo, reset }, state, lifecycle, lookup } = useStepper();
  const currentStep = lookup.getIndex(state.current.data.id);

  return (
    <CredenzaContent className="min-w-4xl mx-auto w-full h-[700px] flex flex-col">
      <CredenzaHeader className="flex flex-row items-center space-x-4">
        <StepIndicator
          currentStep={currentStep + 1}
          totalSteps={state.all.length}
          isLast={state.isLast}
        />
        <div className="space-y-1 flex flex-col">
          <CredenzaTitle className="text-xl font-bold">
            {state.current.data.title}
          </CredenzaTitle>
          <CredenzaDescription className="text-muted-foreground text-md">
            {state.current.data.description}
          </CredenzaDescription>
        </div>
      </CredenzaHeader>

      <div className="flex-1 overflow-hidden">
        {flow.switch({
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
