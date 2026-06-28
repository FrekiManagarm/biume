import { FileText, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ReportsStatsProps {
  total: number;
  brouillons: number;
  finalises: number;
  rapportsCeMois: number;
}

export function ReportsStats({
  total,
  brouillons,
  finalises,
  rapportsCeMois,
}: ReportsStatsProps) {
  const envoyes = Math.max(total - brouillons - finalises, 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-[1.5rem] border-border/70 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                A compléter
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums">
                {brouillons}
              </p>
              <p className="text-muted-foreground text-xs">
                Brouillons à reprendre
              </p>
            </div>
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-950/40">
              <Clock className="text-amber-700 size-6 dark:text-amber-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] border-border/70 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Prêts à envoyer
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums">
                {finalises}
              </p>
              <p className="text-muted-foreground text-xs">
                {total > 0 ? Math.round((finalises / total) * 100) : 0}% du
                total
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-950/40">
              <CheckCircle className="text-blue-700 size-6 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] border-border/70 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Envoyés
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{envoyes}</p>
              <p className="text-muted-foreground text-xs">
                +{rapportsCeMois} créé(s) ce mois
              </p>
            </div>
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-950/40">
              <FileText className="text-emerald-700 size-6 dark:text-emerald-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
