import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";
import Link from "next/link";

export default function ReportNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <FileX className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Rapport introuvable</h2>
            <p className="text-muted-foreground">
              Le rapport que vous recherchez n&apos;existe pas ou vous
              n&apos;avez pas les autorisations nécessaires pour y accéder.
            </p>
          </div>
          <div className="flex gap-2 justify-center pt-4">
            <Button asChild variant="default">
              <Link href="/dashboard/reports">Retour aux rapports</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Retour au tableau de bord</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
