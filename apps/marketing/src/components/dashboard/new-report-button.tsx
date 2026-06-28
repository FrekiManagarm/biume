"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InitializationDialog } from "@/components/reports-module/components/InitializationDialog";

export function NewReportButton({
  label = "Nouveau compte rendu anatomique",
  variant = "default",
  size = "default",
  className,
}: {
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        {label}
      </Button>
      <InitializationDialog showInitDialog={open} setShowInitDialog={setOpen} />
    </>
  );
}
