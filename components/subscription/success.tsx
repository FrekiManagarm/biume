"use client";

import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/api/actions/organization.action";
import { startTrialWorkflow } from "@/lib/api/actions/trial.action";
import { toast } from "sonner";
import { useActiveOrganization } from "@/lib/auth/auth-client";

const SubscriptionSuccessComponent = ({ orgId }: { orgId: string }) => {
  const router = useRouter();
  const { refetch } = useActiveOrganization();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (orgId: string) => {
      // Finaliser l'onboarding
      await completeOnboarding(orgId);

      // Démarrer le workflow de période d'essai en arrière-plan
      // Ne pas attendre le résultat pour ne pas bloquer l'UX
      await startTrialWorkflow(orgId);
    },
    onSuccess: () => {
      refetch();
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Erreur lors de la finalisation de l'onboarding");
    },
  });

  const handleCompleteOnboarding = async () => {
    await mutateAsync(orgId);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Abonnement activé !</CardTitle>
          <CardDescription>
            Votre abonnement a été activé avec succès.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            variant="outline"
            className="w-full"
            disabled={isPending}
            onClick={handleCompleteOnboarding}
          >
            Aller au dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccessComponent;
