"use server";

import { autumn } from "@/lib/utils/autumn";
import { db } from "@/lib/utils/db";
import { organization as organizationSchema } from "@/lib/schemas";
import { eq } from "drizzle-orm";
import { trialWorkflow } from "@/lib/trigger/trial.trigger";
import { tasks } from "@trigger.dev/sdk/v3";

/**
 * Démarre le workflow de période d'essai pour une organisation
 * Récupère les informations depuis Autumn et déclenche le workflow Trigger.dev
 */
export async function startTrialWorkflow(organizationId: string) {
  try {
    console.log(
      `[Trial Action] Démarrage du workflow pour l'organisation ${organizationId}`,
    );

    // Récupérer l'organisation depuis la DB
    const org = await db.query.organization.findFirst({
      where: eq(organizationSchema.id, organizationId),
    });

    if (!org) {
      throw new Error(`Organization ${organizationId} not found`);
    }

    if (!org.customerStripeId) {
      throw new Error(
        `Organization ${organizationId} has no Stripe customer ID`,
      );
    }

    // Récupérer les informations du customer depuis Autumn
    console.log(
      `[Trial Action] Récupération des données Autumn pour le customer ${org.customerStripeId}`,
    );

    const customerResponse = await autumn.customers.get(
      org.customerStripeId,
    );

    if (!customerResponse.data) {
      throw new Error(`Failed to retrieve customer data from Autumn`);
    }

    const customer = customerResponse.data;
    const subscriptions = customer.products;

    // Trouver une subscription avec trial actif
    const trialSubscription = subscriptions?.find((sub) => {
      return (
        sub.status === "trialing" ||
        (sub.current_period_end && new Date(sub.current_period_end) > new Date())
      );
    });

    if (!trialSubscription) {
      console.log(
        `[Trial Action] Aucune période d'essai active trouvée pour ${organizationId}`,
      );
      return {
        success: false,
        message: "No active trial found",
      };
    }

    // Extraire les dates de trial
    const trialStart = trialSubscription.current_period_start
      ? new Date(trialSubscription.current_period_start).toISOString()
      : new Date().toISOString();

    const trialEnd = trialSubscription.current_period_end
      ? new Date(trialSubscription.current_period_end).toISOString()
      : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(); // 15 jours par défaut

    console.log(
      `[Trial Action] Période d'essai trouvée : ${trialStart} -> ${trialEnd}`,
    );

    // Déclencher le workflow Trigger.dev
    const workflowHandle = await tasks.trigger("trial-workflow", {
      organizationId: org.id,
      organizationName: org.name,
      organizationEmail: org.email || customer.email || "",
      trialStart,
      trialEnd,
    });

    console.log(
      `[Trial Action] Workflow déclenché avec l'ID : ${workflowHandle.id}`,
    );

    return {
      success: true,
      workflowId: workflowHandle.id,
      trialStart,
      trialEnd,
    };
  } catch (error) {
    console.error(
      `[Trial Action] Erreur lors du démarrage du workflow :`,
      error,
    );

    // Ne pas throw pour éviter de bloquer l'UX utilisateur
    // Juste logger l'erreur et retourner un résultat d'échec
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
