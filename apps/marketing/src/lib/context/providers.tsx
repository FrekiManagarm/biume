"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";
import { HotkeysProvider } from "react-hotkeys-hook";
import { AutumnProvider } from "autumn-js/react";
import { FocusModeProvider } from "./focus-mode-context";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Providers = ({ children }: PropsWithChildren) => {
  if (process.env.NODE_ENV === "development") {
    return (
      <QueryClientProvider client={queryClient}>
        <AutumnProvider>
          <HotkeysProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange={true}
            >
              <FocusModeProvider>
                {children}
                <Toaster />
              </FocusModeProvider>
            </ThemeProvider>
          </HotkeysProvider>
        </AutumnProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AutumnProvider>
        <HotkeysProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={true}
          >
            <FocusModeProvider>
              {children}
              <Toaster />
            </FocusModeProvider>
          </ThemeProvider>
        </HotkeysProvider>
      </AutumnProvider>
    </QueryClientProvider>
  );
};

export default Providers;
