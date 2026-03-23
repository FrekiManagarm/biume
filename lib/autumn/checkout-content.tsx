import { AttachAction, PlanStatus } from "autumn-js";
import type { ReactNode } from "react";
import type { CheckoutPreviewResult } from "@/lib/autumn/checkout-types";

function primaryPlan(preview: CheckoutPreviewResult) {
  return preview.incoming[0]?.plan;
}

function outgoingPlan(preview: CheckoutPreviewResult) {
  return preview.outgoing[0]?.plan;
}

export const getCheckoutContent = (preview: CheckoutPreviewResult) => {
  const plan = primaryPlan(preview);
  const currentPlan = outgoingPlan(preview);
  const eligibility = plan?.customerEligibility;
  const action = eligibility?.attachAction;
  const status = eligibility?.status;

  const nextCycleAtStr = preview.nextCycle
    ? new Date(preview.nextCycle.startsAt).toLocaleDateString()
    : undefined;

  if (!plan) {
    return {
      title: <p>Confirmation</p> as ReactNode,
      message: (
        <p>Confirmez pour appliquer les changements de facturation.</p>
      ) as ReactNode,
    };
  }

  const productName = plan.name;

  if (plan.price?.interval === "one_off") {
    return {
      title: <p>Acheter {productName}</p>,
      message: (
        <p>
          En confirmant, vous achetez {productName} et votre carte sera
          débitée immédiatement.
        </p>
      ),
    };
  }

  if (
    status === PlanStatus.Scheduled ||
    (action === AttachAction.None && preview.outgoing.length > 0)
  ) {
    return {
      title: <p>{productName} déjà planifié</p>,
      message: (
        <p>
          Vous êtes actuellement sur {currentPlan?.name ?? "votre formule"}{" "}
          et passerez à {productName}
          {nextCycleAtStr ? ` le ${nextCycleAtStr}` : ""}.
        </p>
      ),
    };
  }

  if (
    plan.freeTrial &&
    eligibility?.trialAvailable !== false &&
    eligibility?.trialing !== true
  ) {
    return {
      title: <p>Démarrer l&apos;essai : {productName}</p>,
      message: (
        <p>
          En confirmant, vous démarrez un essai gratuit de {productName}
          {nextCycleAtStr ? ` jusqu&apos;au ${nextCycleAtStr}` : ""}.
        </p>
      ),
    };
  }

  switch (action) {
    case AttachAction.None:
      if (status === PlanStatus.Active) {
        return {
          title: <p>Produit déjà actif</p>,
          message: <p>Vous êtes déjà abonné à cette offre.</p>,
        };
      }
      break;

    case AttachAction.Upgrade:
      return {
        title: <p>Passer à {productName}</p>,
        message: (
          <p>
            En confirmant, vous passez à {productName} et votre moyen de
            paiement sera débité immédiatement.
          </p>
        ),
      };

    case AttachAction.Downgrade:
      return {
        title: <p>Rétrograder vers {productName}</p>,
        message: (
          <p>
            En confirmant, votre abonnement à {currentPlan?.name ?? "votre formule actuelle"} prendra fin et {productName} commencera
            {nextCycleAtStr ? ` le ${nextCycleAtStr}` : ""}.
          </p>
        ),
      };

    case AttachAction.Activate:
      if (preview.total === 0) {
        return {
          title: <p>Activer {productName}</p>,
          message: (
            <p>
              En confirmant, {productName} sera activé immédiatement.
            </p>
          ),
        };
      }
      return {
        title: <p>Souscrire à {productName}</p>,
        message: (
          <p>
            En confirmant, vous souscrivez à {productName} et votre carte sera
            débitée immédiatement.
          </p>
        ),
      };

    case AttachAction.Purchase:
      return {
        title: <p>Acheter {productName}</p>,
        message: (
          <p>
            En confirmant, vous finalisez l&apos;achat de {productName}.
          </p>
        ),
      };

    default:
      break;
  }

  return {
    title: <p>Modifier l&apos;abonnement</p>,
    message: <p>Vous êtes sur le point de modifier votre abonnement.</p>,
  };
};

/** Filtre les lignes de plan affichées comme « prix » (hors simples drapeaux booléens). */
export function isPlanItemPricedRow(item: {
  feature?: { type?: string | null } | null;
}): boolean {
  return item.feature?.type !== "boolean";
}
