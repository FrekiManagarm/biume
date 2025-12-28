"use client";

import { usePathname, useParams } from "next/navigation";
import { useActiveOrganization } from "@/lib/auth/auth-client";
import { useState, useEffect, useMemo } from "react";
import { getActionsHistory } from "@/lib/ai/context-builder";
import type { AppContext } from "@/lib/ai/context-builder";

/**
 * Hook qui agrège le contexte applicatif enrichi pour l'agent IA
 * 
 * Combine :
 * - La page actuelle (pathname)
 * - L'organisation active
 * - Le patient sélectionné (depuis localStorage)
 * - Le client sélectionné (depuis URL params si disponible)
 * - L'historique des actions récentes
 */
export function useAppContext(): AppContext {
  const pathname = usePathname();
  const params = useParams();
  const { data: organization } = useActiveOrganization();
  
  // État pour le patient sélectionné (depuis localStorage)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  // État pour l'historique des actions
  const [recentActions, setRecentActions] = useState<string[]>([]);

  // Charger le patient sélectionné depuis localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedPetId = localStorage.getItem("currentPetId");
    if (storedPetId && storedPetId.trim() !== "") {
      setSelectedPatientId(storedPetId);
    }

    // Écouter les changements de localStorage (si le patient change dans un autre onglet/composant)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentPetId") {
        setSelectedPatientId(e.newValue && e.newValue.trim() !== "" ? e.newValue : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Charger l'historique des actions
  useEffect(() => {
    if (typeof window === "undefined") return;

    const history = getActionsHistory();
    setRecentActions(history);

    // Optionnel : écouter les changements de localStorage pour l'historique
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "biume-ai-actions-history") {
        const updatedHistory = getActionsHistory();
        setRecentActions(updatedHistory);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Détecter le client sélectionné depuis les params URL (si disponible)
  const selectedClientId = useMemo(() => {
    if (params?.clientId && typeof params.clientId === "string") {
      return params.clientId;
    }
    return null;
  }, [params]);

  // Construire le contexte enrichi
  const context: AppContext = useMemo(
    () => ({
      organizationId: organization?.id,
      currentPage: pathname || "/dashboard",
      selectedPatient: selectedPatientId
        ? { id: selectedPatientId }
        : undefined,
      selectedClient: selectedClientId
        ? { id: selectedClientId }
        : undefined,
      recentActions,
    }),
    [organization?.id, pathname, selectedPatientId, selectedClientId, recentActions],
  );

  return context;
}

