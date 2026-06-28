import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUser } from "@/lib/api/actions/auth.action";
import { Users, PawPrint, FileText, Plus } from "lucide-react";
import Link from "next/link";

export async function DashboardHeader() {
  const session = await getUser();

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bonjour, {session.user.name} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Voici un aperçu de votre activité aujourd&apos;hui
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="default" className="gap-2">
            <Plus className="size-4" />
            Actions rapides
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/reports/new"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="flex items-center justify-center rounded-md p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                <FileText className="size-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau rapport</p>
                <p className="text-xs text-muted-foreground">
                  Créer un compte rendu
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/patients?action=new"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="flex items-center justify-center rounded-md p-1.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">
                <PawPrint className="size-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ajouter un patient</p>
                <p className="text-xs text-muted-foreground">
                  Enregistrer un animal
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/clients?action=new"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="flex items-center justify-center rounded-md p-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                <Users className="size-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ajouter un client</p>
                <p className="text-xs text-muted-foreground">
                  Nouveau propriétaire
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
