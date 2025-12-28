"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CheckoutDialog, useCustomer } from "autumn-js/react"
import { allInclusiveMonthly, allInclusiveYearly } from "@/autumn.config"

type RequireSubscriptionDialogProps = {
  open?: boolean
  trigger?: React.ReactNode
}

const NonPayedSubscriptionModal: React.FC<RequireSubscriptionDialogProps> = ({
  open,
  trigger,
}) => {
  const [isAnnual, setIsAnnual] = useState(true)
  const { checkout, customer } = useCustomer()

  const { monthlyPrice, annualPrice, annualTotal, savings } = useMemo(() => {
    const monthlyPrice = 24.99
    const annualPrice = 19.99
    const annualTotal = annualPrice * 12
    const savings = monthlyPrice * 12 - annualTotal
    return { monthlyPrice, annualPrice, annualTotal, savings }
  }, [])

  const features = useMemo(
    () => [
      "Comptes rendus illimités",
      "Fiches clients & patients",
      "Export PDF pro",
      "IA vulgarisation",
      "Suivi intelligent",
      "Support 7j/7",
    ],
    []
  )

  const handleSubscribe = async () => {
    try {
      await checkout({
        productId: isAnnual ? allInclusiveYearly.id : allInclusiveMonthly.id,
        dialog: CheckoutDialog,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/transactions/subscriptions/success?org=${customer?.id}`,
        checkoutSessionParams: {
          automatic_tax: {
            enabled: true,
          },
          customer_update: {
            address: "auto",
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AlertDialog open={open}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Abonnement requis</AlertDialogTitle>
          <AlertDialogDescription>
            Pour continuer à utiliser Biume sans limitation, choisissez une formule.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* Cartes prix compactes */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`rounded-md border p-3 text-center ${!isAnnual ? "border-primary ring-1 ring-primary/20" : "border-border"
              }`}
            onClick={() => setIsAnnual(false)}
          >
            <div className="text-xs text-muted-foreground mb-1">Mensuel</div>
            <div className="text-2xl font-bold">{monthlyPrice.toFixed(2)}€</div>
            <div className="text-xs text-muted-foreground">/mois</div>
          </div>

          <div
            className={`rounded-md border p-3 text-center ${isAnnual ? "border-primary ring-1 ring-primary/20" : "border-border"
              }`}
            onClick={() => setIsAnnual(true)}
          >
            <div className="flex items-center justify-center gap-1 text-xs mb-1">
              <span className="text-muted-foreground">Annuel</span>
              <span className="text-green-600 dark:text-green-400">-25%</span>
            </div>
            <div className="text-2xl font-bold">{annualPrice.toFixed(2)}€</div>
            <div className="text-xs text-muted-foreground">/mois</div>
            <div className="mt-1 text-[10px] text-muted-foreground">
              {annualTotal.toFixed(0)}€/an • Économisez {savings.toFixed(0)}€
            </div>
          </div>
        </div>

        {/* Bénéfices condensés */}
        <div className="text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            {features.slice(0, 6).map((feature, idx) => (
              <span key={idx} className="inline-flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                {feature}
              </span>
            ))}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={handleSubscribe}>
              Commencer l&apos;essai gratuit
            </Button>
          </AlertDialogAction>
          <Button asChild variant="outline">
            <Link href="/#pricing">Comparer les tarifs</Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default NonPayedSubscriptionModal