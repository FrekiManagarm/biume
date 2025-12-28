"use client";

import React from "react";

const DemoClientFallback = () => {
  return (
    <div className="w-full max-w-3xl mx-auto rounded-lg border p-6 text-center">
      <h2 className="text-lg font-semibold">Prise de rendez-vous indisponible</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Le module de réservation n’a pas pu se charger. Vous pouvez nous contacter pour planifier une démo.
      </p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <a
          href="mailto:contact@biume.fr"
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Nous écrire
        </a>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
        >
          Formulaire de contact
        </a>
      </div>
    </div>
  );
};

export default DemoClientFallback;
