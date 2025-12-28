"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Download,
  Calendar,
  Crown,
  CheckCircle,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { useCustomer } from "autumn-js/react";
import { allInclusiveYearly } from "@/autumn.config";
import CheckoutDialog from "@/components/autumn/checkout-dialog";
import { Spinner } from "@/components/ui/spinner";

const BillingTab = () => {
  const { attach, customer, cancel } = useCustomer({ expand: ["invoices"] });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      await attach({
        productId: allInclusiveYearly.id,
        dialog: CheckoutDialog,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=billing`,
      });
    } catch (error) {
      toast.error("Erreur lors de la mise à niveau");
      console.error(error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async (productId: string) => {
    try {
      setIsLoading(true);
      await cancel({ productId });
      toast.success("Abonnement annulé");
    } catch (error) {
      toast.error("Erreur lors de l'annulation de l'abonnement");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSubscriptionStatus = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Actif",
          variant: "outline" as const,
          color: "text-green-600",
        };
      case "canceled":
        return {
          label: "Annulé",
          variant: "outline" as const,
          color: "text-red-600",
        };
      case "past_due":
        return {
          label: "En retard",
          variant: "outline" as const,
          color: "text-red-600",
        };
      case "trialing":
        return {
          label: "Essai",
          variant: "outline" as const,
          color: "text-white",
        };
      default:
        return {
          label: status,
          variant: "outline" as const,
          color: "text-gray-600",
        };
    }
  };

  // Utiliser les données du customer pour les abonnements
  const activeSubscription = customer?.products?.find(
    (product) => product.status === "active" || product.status === "trialing",
  );

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Facturation</h2>
        <p className="text-muted-foreground">
          Gérez vos abonnements, factures et informations de facturation.
        </p>
      </div>

      {/* Abonnement actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Abonnement actuel
          </CardTitle>
          <CardDescription>
            Informations sur votre plan d&apos;abonnement actuel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {activeSubscription ? (
            <>
              {/* Plan et statut */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border bg-muted/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Plan actuel
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatCurrency(
                        (activeSubscription.items?.[0]?.price || 0) * 100,
                        "EUR",
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /
                      {activeSubscription.items?.[0]?.interval === "year"
                        ? "an"
                        : "mois"}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    getSubscriptionStatus(activeSubscription.status).variant
                  }
                  className={`${getSubscriptionStatus(activeSubscription.status).color} flex items-center gap-1`}
                >
                  {activeSubscription.status === "active" && (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  {activeSubscription.status === "trialing" && (
                    <Clock className="h-3 w-3" />
                  )}
                  {getSubscriptionStatus(activeSubscription.status).label}
                </Badge>
              </div>

              {/* Informations détaillées */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Période actuelle
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Du{" "}
                    {formatDate(
                      new Date(
                        activeSubscription.current_period_start || 0,
                      ).toISOString(),
                    )}{" "}
                    au{" "}
                    {formatDate(
                      new Date(
                        activeSubscription.current_period_end || 0,
                      ).toISOString(),
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    Prochaine facturation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(
                      new Date(
                        activeSubscription.current_period_end || 0,
                      ).toISOString(),
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleCancelSubscription(activeSubscription.id)
                  }
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Annulation..." : "Annuler l'abonnement"}
                </Button>
                <Button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="flex-1"
                >
                  {isUpgrading ? "Mise à niveau..." : "Mettre à niveau"}
                </Button>
              </div>
            </>
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <Crown className="h-6 w-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Aucun abonnement actif</EmptyTitle>
                <EmptyDescription>
                  Vous n&apos;avez pas d&apos;abonnement actif. Choisissez un
                  plan pour commencer à utiliser toutes les fonctionnalités de
                  Biume.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  size="lg"
                >
                  {isUpgrading ? "Chargement..." : "Choisir un plan"}
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>

      {/* Historique des factures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Historique des factures
          </CardTitle>
          <CardDescription>
            Consultez et téléchargez vos factures précédentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customer?.invoices && customer.invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.invoices.map((invoice) => (
                  <TableRow key={invoice.stripe_id}>
                    <TableCell>
                      {formatDate(new Date(invoice.created_at).toISOString())}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(invoice.total, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "paid" ? "default" : "destructive"
                        }
                      >
                        {invoice.status === "paid" ? "Payée" : "En attente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.hosted_invoice_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(invoice.hosted_invoice_url, "_blank")
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <Calendar className="h-6 w-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Aucune facture disponible</EmptyTitle>
                <EmptyDescription>
                  Vos factures apparaîtront ici une fois que vous aurez souscrit
                  à un abonnement.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingTab;
