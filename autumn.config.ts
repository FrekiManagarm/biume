import { feature, item, plan } from "atmn";

// Features
export const supportPrioritaire = feature({
  id: "support_prioritaire",
  name: "Support prioritaire",
  type: "boolean",
});

export const fichesClientsPatientsIllimits = feature({
  id: "fiches_clients_patients_illimits",
  name: "Fiches clients patients illimités",
  type: "boolean",
});

export const suiviDeSantIntelligent = feature({
  id: "suivi_de_sant_intelligent",
  name: "Suivi de santé intelligent",
  type: "boolean",
});

export const exportPdfProfessionnel = feature({
  id: "export_pdf_professionnel",
  name: "Export PDF Professionnel",
  type: "boolean",
});

export const iaVulgarisation = feature({
  id: "ia_vulgarisation",
  name: "IA vulgarisation",
  type: "boolean",
});

export const rapportsIllimits = feature({
  id: "rapports_illimits",
  name: "Rapports illimités",
  type: "boolean",
});

// Products
export const allInclusiveMonthly = plan({
  id: "all_inclusive_monthly",
  name: "All inclusive monthly",
  price: {
    amount: 29.99,
    interval: "month",
  },
  items: [
    item({
      featureId: exportPdfProfessionnel.id,
      included: 0,
    }),
    item({
      featureId: fichesClientsPatientsIllimits.id,
      included: 0,
    }),
    item({
      featureId: iaVulgarisation.id,
      included: 0,
    }),
    item({
      featureId: rapportsIllimits.id,
      included: 0,
    }),
    item({
      featureId: suiviDeSantIntelligent.id,
      included: 0,
    }),
    item({
      featureId: supportPrioritaire.id,
      included: 0,
    }),
  ],
  freeTrial: { durationLength: 15, durationType: "day", cardRequired: true },
});

export const allInclusiveYearly = plan({
  id: "all_inclusive_yearly",
  name: "All inclusive yearly",
  price: {
    amount: 299.88,
    interval: "year",
  },
  items: [
    item({
      featureId: exportPdfProfessionnel.id,
      included: 0,
    }),
    item({
      featureId: fichesClientsPatientsIllimits.id,
      included: 0,
    }),
    item({
      featureId: iaVulgarisation.id,
      included: 0,
    }),
    item({
      featureId: rapportsIllimits.id,
      included: 0,
    }),
    item({
      featureId: suiviDeSantIntelligent.id,
      included: 0,
    }),
    item({
      featureId: supportPrioritaire.id,
      included: 0,
    }),
  ],
  freeTrial: { durationLength: 15, durationType: "day", cardRequired: true },
});
