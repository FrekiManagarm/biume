"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function useDailySummary() {
  const {
    messages,
    status,
    error,
    sendMessage: send,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming";

  const requestDailySummary = async (
    organizationId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      periodType?: "day" | "week" | "month";
    },
  ) => {
    const { startDate, endDate, periodType = "day" } = options || {};

    let prompt = "";
    if (periodType === "month") {
      const monthLabel = startDate
        ? format(startDate, "MMMM yyyy", { locale: fr })
        : "ce mois";
      prompt = `Peux-tu me faire un résumé synthétique de mes rendez-vous pour ${monthLabel} ? Inclus les rendez-vous prévus, leurs statuts, répartition par semaine si pertinent, et toute information pertinente.`;
    } else if (periodType === "week") {
      const weekLabel = startDate && endDate
        ? `du ${format(startDate, "d MMMM", { locale: fr })} au ${format(endDate, "d MMMM yyyy", { locale: fr })}`
        : "cette semaine";
      prompt = `Peux-tu me faire un résumé synthétique de mes rendez-vous pour la semaine ${weekLabel} ? Inclus les rendez-vous prévus, leurs statuts, répartition par jour si pertinent, et toute information pertinente.`;
    } else {
      prompt = "Peux-tu me faire un résumé synthétique de ma journée d'aujourd'hui ? Inclus les rendez-vous prévus, leurs statuts, et toute information pertinente.";
    }

    await send(
      {
        text: prompt,
      },
      {
        body: {
          context: {
            organizationId,
            currentPage: "dashboard",
            recentActions: [],
            ...(startDate && { startDate: startDate.toISOString() }),
            ...(endDate && { endDate: endDate.toISOString() }),
            periodType,
          },
        },
      },
    );
  };

  const reset = () => setMessages([]);

  return {
    messages,
    isLoading,
    error,
    requestDailySummary,
    reset,
  };
}
