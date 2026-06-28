"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

// next-themes injecte un <script> inline pour éviter le flash de thème avant hydratation.
// React 19 remonte une erreur console pour toute balise <script> dans l’arbre — faux positif ici.
// Voir https://github.com/shadcn-ui/ui/issues/10104
if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "development"
) {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    orig.apply(console, args);
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
