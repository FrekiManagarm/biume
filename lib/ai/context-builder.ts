export interface AppContext {
  organizationId?: string;
  currentPage: string;
  selectedPatient?: {
    id: string;
    name?: string;
  };
  selectedClient?: {
    id: string;
    name?: string;
  };
  recentActions: string[];
}

/**
 * Construit un prompt contextuel à partir du contexte applicatif
 * pour enrichir les requêtes à l'agent IA
 */
export function buildContextPrompt(context: AppContext): string {
  const sections: string[] = [];

  // Section date actuelle (TOUJOURS en premier)
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeFormatted = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const isoDate = now.toISOString();
  sections.push(`📅 **Date et heure actuelles** : ${dateFormatted} à ${timeFormatted}\n   (ISO: ${isoDate})\n   ⚠️ **IMPORTANT** : Utilise TOUJOURS cette date pour calculer les rendez-vous. L'année est ${now.getFullYear()}.`);

  // Section page actuelle
  if (context.currentPage) {
    const pageName = getPageDisplayName(context.currentPage);
    sections.push(`📍 **Page actuelle** : ${pageName}`);
  }

  // Section patient sélectionné
  if (context.selectedPatient) {
    const patientInfo = context.selectedPatient.name
      ? `${context.selectedPatient.name} (ID: ${context.selectedPatient.id})`
      : `ID: ${context.selectedPatient.id}`;
    sections.push(`🐾 **Patient sélectionné** : ${patientInfo}`);
  }

  // Section client sélectionné
  if (context.selectedClient) {
    const clientInfo = context.selectedClient.name
      ? `${context.selectedClient.name} (ID: ${context.selectedClient.id})`
      : `ID: ${context.selectedClient.id}`;
    sections.push(`👤 **Client sélectionné** : ${clientInfo}`);
  }

  // Section actions récentes
  if (context.recentActions && context.recentActions.length > 0) {
    sections.push(
      `📋 **Actions récentes** :\n${context.recentActions.map((action) => `  - ${action}`).join("\n")}`,
    );
  }

  // Assembler le prompt final
  if (sections.length === 0) {
    return "";
  }

  return `**CONTEXTE ACTUEL DE L'UTILISATEUR :**

${sections.join("\n\n")}

---

Utilise ce contexte pour proposer des actions pertinentes et éviter de redemander des informations déjà disponibles.`;
}

/**
 * Convertit le chemin de page en nom lisible
 */
function getPageDisplayName(pathname: string): string {
  const pageMap: Record<string, string> = {
    "/dashboard": "Tableau de bord",
    "/dashboard/patients": "Liste des patients",
    "/dashboard/clients": "Liste des clients",
    "/dashboard/reports": "Liste des rapports",
    "/dashboard/calendar": "Calendrier",
    "/dashboard/settings": "Paramètres",
    "/dashboard/organization": "Organisation",
  };

  // Chercher une correspondance exacte
  if (pageMap[pathname]) {
    return pageMap[pathname];
  }

  // Chercher une correspondance partielle
  for (const [path, name] of Object.entries(pageMap)) {
    if (pathname.startsWith(path)) {
      return name;
    }
  }

  // Extraire le dernier segment comme fallback
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  }

  return pathname;
}

/**
 * Ajoute une action à l'historique (côté client)
 */
export function addActionToHistory(action: string): void {
  if (typeof window === "undefined") return;

  const MAX_ACTIONS = 5;
  const STORAGE_KEY = "biume-ai-actions-history";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const history: string[] = stored ? JSON.parse(stored) : [];

    // Ajouter la nouvelle action au début
    history.unshift(action);

    // Limiter à MAX_ACTIONS
    const trimmed = history.slice(0, MAX_ACTIONS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Erreur lors de l'ajout d'action à l'historique:", error);
  }
}

/**
 * Récupère l'historique des actions (côté client)
 */
export function getActionsHistory(): string[] {
  if (typeof window === "undefined") return [];

  const STORAGE_KEY = "biume-ai-actions-history";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'historique:",
      error,
    );
    return [];
  }
}

/**
 * Efface l'historique des actions (côté client)
 */
export function clearActionsHistory(): void {
  if (typeof window === "undefined") return;

  const STORAGE_KEY = "biume-ai-actions-history";

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erreur lors de l'effacement de l'historique:", error);
  }
}

