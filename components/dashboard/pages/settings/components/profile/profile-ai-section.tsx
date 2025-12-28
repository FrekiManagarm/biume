"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import Link from "next/link";
import { CreateOrganizationSchema, Organization } from "@/lib/schemas";
import { BrainCircuit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { BetaBadge } from "@/components/ui/beta-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { useCustomer } from "autumn-js/react";
import { iaVulgarisation } from "@/autumn.config";

interface ProfileOnDemandSectionProps {
  org: Organization | undefined;
  form: UseFormReturn<z.infer<typeof CreateOrganizationSchema>>;
}

export const ProfileAiSection = ({
  org,
  form,
}: ProfileOnDemandSectionProps) => {
  const { check, isLoading } = useCustomer();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-4 w-full mt-1" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-9 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!check({ featureId: iaVulgarisation.id }).data.allowed) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">
              Vulgarisation dans les rapports
            </CardTitle>
            <BetaBadge />
          </div>
          <CardDescription className="text-sm mt-1">
            L&apos;IA vulgarise automatiquement vos rapports pour maximiser la
            lisibilité et la compréhension.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <h4 className="font-semibold text-foreground">
                Débloquez la vulgarisation IA
              </h4>
              <p className="text-sm text-muted-foreground">
                Gagnez du temps et améliorez la lisibilité de vos rapports
              </p>
            </div>
            <Button asChild>
              <Link
                href={`/dashboard/organization/${org?.id}/settings?tab=billing`}
                className="flex items-center gap-2"
              >
                Activer
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Vulgarisation dans les rapports</CardTitle>
          <BetaBadge />
        </div>
        <CardDescription>
          L&apos;IA vulgarise automatiquement vos rapports pour maximiser la
          lisibilité et la compréhension.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="ai"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <span className="text-sm text-muted-foreground">
              {form.watch("ai") ? "Activé" : "Désactivé"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
