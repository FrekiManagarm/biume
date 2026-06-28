"use client";

import { useFocusMode } from "@/lib/context/focus-mode-context";

interface FocusModeWrapperProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

export function FocusModeWrapper({
  children,
  sidebar,
  header,
}: FocusModeWrapperProps) {
  const { isFocusMode } = useFocusMode();

  if (isFocusMode) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full w-full overflow-hidden p-4">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen">
      {sidebar}
      {header}
    </div>
  );
}

