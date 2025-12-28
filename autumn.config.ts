import {
	feature,
	product,
	featureItem,
	pricedFeatureItem,
	priceItem,
} from "atmn";

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
export const allInclusiveMonthly = product({
	id: "all_inclusive_monthly",
	name: "All inclusive monthly",
	items: [
		priceItem({
			price: 24.99,
			interval: "month",
		}),

		featureItem({
			feature_id: exportPdfProfessionnel.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: fichesClientsPatientsIllimits.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: iaVulgarisation.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: rapportsIllimits.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: suiviDeSantIntelligent.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: supportPrioritaire.id,
			included_usage: undefined,
		}),
	],
	free_trial: {
		duration: "day",
		length: 15,
		unique_fingerprint: false,
		card_required: true,
	},
});

export const allInclusiveYearly = product({
	id: "all_inclusive_yearly",
	name: "All inclusive yearly",
	items: [
		priceItem({
			price: 239.88,
			interval: "year",
		}),

		featureItem({
			feature_id: exportPdfProfessionnel.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: fichesClientsPatientsIllimits.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: iaVulgarisation.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: rapportsIllimits.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: suiviDeSantIntelligent.id,
			included_usage: undefined,
		}),

		featureItem({
			feature_id: supportPrioritaire.id,
			included_usage: undefined,
		}),
	],
	free_trial: {
		duration: "day",
		length: 15,
		unique_fingerprint: false,
		card_required: true,
	},
});
