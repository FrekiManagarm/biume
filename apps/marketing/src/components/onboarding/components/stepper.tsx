"use client";

import {
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { BadgeCheck, FileText, Sparkles } from "lucide-react";
import Image from "next/image";
import InformationsForm from "./pro/informations-form";

const Stepper = () => {
  return (
    <CredenzaContent className="mx-auto grid max-h-[92vh] w-full max-w-5xl overflow-hidden p-0 md:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden min-h-[640px] overflow-hidden bg-[#101413] text-white md:block">
        <Image
          src="/assets/images/dashboard-image.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-28"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#101413]/35 via-[#101413]/75 to-[#101413]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#101413] to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur">
            <BadgeCheck className="h-4 w-4 text-emerald-300" />
            Biume Pro
          </div>

          <div className="space-y-7">
            <div className="max-w-md space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-200">
                Onboarding express
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white">
                Votre espace est prêt en moins d'une minute.
              </h1>
              <p className="text-base leading-7 text-white/70">
                On crée juste la base. Le reste se configure plus tard, quand
                vous aurez déjà accès aux comptes rendus et au suivi patient.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                {
                  icon: FileText,
                  title: "Compte rendu anatomique",
                  text: "Le coeur du produit reste accessible sans détour.",
                },
                {
                  icon: Sparkles,
                  title: "Vulgarisation propriétaire",
                  text: "Une expérience pensée pour montrer la valeur vite.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#101413]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-white/70">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-[560px] flex-col bg-background">
        <CredenzaHeader className="border-b px-6 py-6 text-left">
          <div className="space-y-2">
            <CredenzaTitle className="text-2xl font-semibold">
              Créer votre espace
            </CredenzaTitle>
            <CredenzaDescription className="text-sm leading-6 text-muted-foreground">
              Deux informations, puis vous passez à l'essentiel.
            </CredenzaDescription>
          </div>
        </CredenzaHeader>

        <div className="flex-1 overflow-y-auto">
          <InformationsForm />
        </div>
      </section>
    </CredenzaContent>
  );
};

export default Stepper;
