"use server";

import { db } from "@/lib/utils/db";
import { organization } from "@/lib/schemas";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export async function completeOnboarding(organizationId: string) {
  try {
    // Vérifier que l'utilisateur est authentifié
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Non authentifié");
    }

    // Vérifier que l'utilisateur appartient à cette organisation
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    const userOrg = organizations?.find(org => org.id === organizationId);
    if (!userOrg) {
      throw new Error("Organisation non trouvée ou accès non autorisé");
    }

    // Marquer l'onboarding comme terminé
    await db
      .update(organization)
      .set({ onBoardingComplete: true })
      .where(eq(organization.id, organizationId));

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la finalisation de l'onboarding:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
  }
}
