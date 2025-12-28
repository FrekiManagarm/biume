"use client";

import { useState } from "react";
import {
  Credenza,
  CredenzaTitle,
  CredenzaHeader,
  CredenzaContent,
} from "../ui/credenza";
import { Button } from "../ui/button";
import { Building2, Plus, Users, Loader2 } from "lucide-react";
import Stepper from "./components/stepper";
import Image from "next/image";
import { toast } from "sonner";
import { Organization } from "@/lib/schemas";
import { useActiveOrganization } from "@/lib/auth/auth-client";
import { handleChangeOrganization } from "@/lib/api/actions/organization.action";
import { useCustomer } from "autumn-js/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface OrganizationConnectProps {
  open: boolean;
  organizations: Organization[];
}

const OrganizationConnect = ({
  open,
  organizations,
}: OrganizationConnectProps) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [hoveredOrgId, setHoveredOrgId] = useState<string | null>(null);
  const [showStepper, setShowStepper] = useState(false);
  const { refetch } = useActiveOrganization();
  const { refetch: refetchCustomer } = useCustomer();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: handleChangeOrganization,
    onSuccess: async () => {
      await refetchCustomer();
      refetch();
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Error selecting organization:", error);
      toast.error("Erreur lors de la sélection de l'organisation");
    },
  });

  const handleSelectOrganization = async (orgId: string) => {
    if (isPending) return;

    setSelectedOrgId(orgId);

    try {
      await mutateAsync(orgId);
    } catch (error) {
      console.error("Error selecting organization:", error);
      toast.error("Erreur lors de la sélection de l'organisation");
    }
  };

  const handleCreateOrganization = () => {
    setShowStepper(true);
  };

  return (
    <Credenza open={open}>
      <CredenzaContent className="max-w-2xl">
        <CredenzaHeader>
          <CredenzaTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            Sélectionner une entreprise
          </CredenzaTitle>
        </CredenzaHeader>

        <div className="space-y-4">
          {organizations && organizations.length > 0 ? (
            <div className="space-y-3">
              {organizations.map((org) => {
                const isSelected = selectedOrgId === org.id;
                const isHovered = hoveredOrgId === org.id;

                return (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrganization(org.id)}
                    disabled={isPending}
                    onMouseEnter={() => setHoveredOrgId(org.id)}
                    onMouseLeave={() => setHoveredOrgId(null)}
                    className={`
                      w-full p-4 border rounded-lg transition-all duration-200 text-left group
                      ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:bg-accent/50 hover:border-border/80"
                      }
                      ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {/* Logo/Avatar avec animation */}
                      <div className="flex-shrink-0">
                        {org.logo ? (
                          <div
                            className={`
                            w-10 h-10 rounded-lg overflow-hidden bg-muted transition-transform duration-200
                            ${isHovered ? "scale-105" : "scale-100"}
                          `}
                          >
                            <Image
                              src={org.logo}
                              alt={org.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`
                            w-10 h-10 bg-muted rounded-lg flex items-center justify-center transition-all duration-200
                            ${isHovered ? "bg-muted/80 scale-105" : "bg-muted scale-100"}
                          `}
                          >
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`
                              font-medium truncate transition-colors duration-200
                              ${isSelected ? "text-primary" : "text-foreground"}
                            `}
                            >
                              {org.name}
                            </h3>
                            {org.description && (
                              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                                {org.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        {org.members && org.members.length > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>
                              {org.members.length} membre
                              {org.members.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Loading ou Arrow indicator */}
                      <div className="flex-shrink-0">
                        {isSelected && isPending ? (
                          <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        ) : (
                          <div
                            className={`
                            transition-all duration-200
                            ${isHovered || isSelected ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1"}
                          `}
                          >
                            <svg
                              className="h-4 w-4 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">
                Aucune organisation
              </h3>
              <p className="text-sm text-muted-foreground">
                Vous n&apos;êtes membre d&apos;aucune organisation pour le
                moment.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button
              onClick={handleCreateOrganization}
              variant="default"
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer une entreprise
            </Button>
            {/* <div className="flex-1">
              <JoinOrganizationButton />
            </div> */}
          </div>
        </div>
      </CredenzaContent>

      {/* Stepper pour créer une nouvelle organisation */}
      <Credenza open={showStepper} onOpenChange={setShowStepper}>
        <Stepper />
      </Credenza>
    </Credenza>
  );
};

export default OrganizationConnect;
