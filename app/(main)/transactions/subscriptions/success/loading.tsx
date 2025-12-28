import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SubscriptionSuccessLoading() {
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
          <Button variant="outline" className="w-full" disabled>
            <Skeleton className="h-4 w-32" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
