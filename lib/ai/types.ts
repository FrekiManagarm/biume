import type { UIMessage } from "ai";

// Type des messages UI avec parts de données custom pour Biume
export type BiumeUIMessage = UIMessage<
  // metadata (none for now)
  never,
  // data parts
  {
    notification: {
      message: string;
      level: "info" | "warning" | "error";
    };
    patientSummary: {
      title: string;
      patientName: string;
      ownerName?: string;
      species?: string;
      breed?: string;
      age?: string;
      highlights?: string[];
    };
    analysisProgress: {
      label: string;
      percent: number; // 0..100
    };
  }
>;
