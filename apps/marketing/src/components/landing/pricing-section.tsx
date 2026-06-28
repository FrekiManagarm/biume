"use client";

import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/style";
import { productAppHref } from "@/lib/config/product-app-url";

const plans = [
  {
    id: "entry",
    name: "Essai résultat",
    badge: "Gratuit",
    monthlyPrice: "0€",
    annualPrice: "0€",
    suffix: "",
    monthlyBilling: "Sans compte, sans carte bancaire.",
    annualBilling: "Toujours gratuit.",
    note: "Transformez un ancien compte rendu anonymisé avant de créer un compte.",
    cta: "Transformer un rapport",
    href: productAppHref("/sign-up"),
    highlighted: false,
    features: [
      "Transformation d'un vrai cas",
      "Aperçu du rendu anatomique",
      "Version propriétaire vulgarisée",
      "Décision sur pièce",
    ],
  },
  {
    id: "report-pro",
    name: "Biume Rapport Pro",
    badge: "Recommandé",
    monthlyPrice: "29€",
    annualPrice: "24€",
    suffix: "/mois",
    monthlyBilling: "Facturé chaque mois. Sans engagement.",
    annualBilling: "288€ facturés par an. Vous économisez 60€.",
    note: "Le plan principal pour produire des rapports anatomiques prêts à envoyer.",
    cta: "Démarrer Rapport Pro",
    href: productAppHref("/sign-up"),
    highlighted: true,
    features: [
      "Comptes rendus anatomiques",
      "Schémas chien, chat, cheval",
      "Vulgarisation IA propriétaire",
      "Export PDF professionnel",
      "Clients, patients et historique",
      "Agenda basique inclus",
    ],
  },
  {
    id: "cabinet",
    name: "Biume Cabinet",
    badge: "Plus tard",
    monthlyPrice: "49€",
    annualPrice: "39€",
    suffix: "/mois",
    monthlyBilling: "Accès prioritaire sur demande.",
    annualBilling: "468€ facturés par an. Accès prioritaire.",
    note: "Pour professionnaliser toute l'expérience cabinet autour des rapports.",
    cta: "Demander l'accès",
    href: "https://cal.com/mathieu-chambaud-biume",
    highlighted: false,
    features: [
      "Branding avancé",
      "Modèles personnalisés",
      "Rappels propriétaires",
      "Statistiques et automatisations",
    ],
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/4 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="mb-10 grid gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-end"
          >
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/6 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                Offre orientée résultat
              </div>
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Des rapports professionnels pour{" "}
                <span className="text-primary">moins d'une consultation</span>
              </h2>
            </div>
            <div className="space-y-5 md:justify-self-end">
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Le prix se défend parce que Biume vend le livrable final : un
                compte rendu clair, visuel et prêt à envoyer.
              </p>
              <BillingSwitch isAnnual={isAnnual} onChange={setIsAnnual} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="grid gap-5 lg:grid-cols-3"
          >
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} isAnnual={isAnnual} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BillingSwitch({
  isAnnual,
  onChange,
}: {
  isAnnual: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/45 bg-card/60 p-1 shadow-sm backdrop-blur-xl">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-all",
          !isAnnual
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Mensuel
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
          isAnnual
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Annuel
        <span className="rounded-full bg-secondary/10 px-1.5 py-0.5 text-[10px] font-bold text-secondary">
          économies
        </span>
      </button>
    </div>
  );
}

type Plan = (typeof plans)[number];

function PricingCard({ plan, isAnnual }: { plan: Plan; isAnnual: boolean }) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const billing = isAnnual ? plan.annualBilling : plan.monthlyBilling;
  const isExternal = plan.href.startsWith("http");

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-3xl border border-border/45 bg-card/60 p-6 shadow-[0_24px_80px_-60px_rgba(0,0,0,0.32)] backdrop-blur-xl md:p-7",
        plan.highlighted && "border-primary/30 ring-1 ring-primary/15"
      )}
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {plan.note}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            plan.highlighted
              ? "bg-primary/10 text-primary"
              : "bg-muted/70 text-muted-foreground"
          )}
        >
          {plan.badge}
        </span>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-baseline gap-1.5">
          <motion.span
            key={`${plan.id}-${price}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold tabular-nums"
          >
            {price}
          </motion.span>
          {plan.suffix && (
            <span className="text-lg text-muted-foreground">{plan.suffix}</span>
          )}
        </div>
        <p
          className={cn(
            "text-sm font-medium",
            plan.highlighted && isAnnual
              ? "text-secondary"
              : "text-muted-foreground"
          )}
        >
          {billing}
        </p>
      </div>

      <Button
        size="lg"
        variant={plan.highlighted ? "default" : "outline"}
        className={cn(
          "h-12 w-full rounded-full text-base transition-all hover:scale-[1.01] active:scale-[0.99]",
          plan.highlighted && "shadow-lg shadow-primary/15 hover:shadow-primary/25"
        )}
        asChild
      >
        <Link
          href={plan.href}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {plan.cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>

      <div className="mt-7 space-y-3 border-t border-border/35 pt-6">
        {plan.features.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
