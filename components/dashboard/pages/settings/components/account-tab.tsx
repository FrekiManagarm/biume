"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  UserX,
  Download,
  Trash2,
  AlertCircle,
  FileText,
  Calendar,
  Mail
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteAccount, exportUserData, exportOrganizationData } from "@/lib/api/actions/user.action";
import { useSession } from "@/lib/auth/auth-client";

const deleteAccountSchema = z.object({
  confirmationText: z.string().refine(
    (text) => text === "SUPPRIMER",
    "Vous devez taper 'SUPPRIMER' pour confirmer la suppression"
  ),
});

type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

const AccountTab = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteForm = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      confirmationText: "",
    },
  });

  const onDeleteSubmit = async (data: DeleteAccountFormValues) => {
    setIsLoading(true);
    try {
      await deleteAccount(data);
      toast.success("Compte supprimé avec succès");
      // La redirection sera gérée par la déconnexion automatique
    } catch (error) {
      toast.error("Erreur lors de la suppression du compte");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const data = await exportUserData();

      // Créer et télécharger le fichier JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `biume-donnees-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Données exportées avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'export des données");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportOrganizationData = async () => {
    setIsLoading(true);
    try {
      const data = await exportOrganizationData();

      // Créer et télécharger le fichier JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `biume-clients-patients-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Données clients et patients exportées avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'export des données clients et patients");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Compte</h2>
        <p className="text-muted-foreground">
          Gérez votre compte et vos données personnelles.
        </p>
      </div>

      {/* Informations du compte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Informations du compte
          </CardTitle>
          <CardDescription>
            Vos informations de compte et préférences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </h4>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email || 'Non disponible'}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Membre depuis
              </h4>
              <p className="text-sm text-muted-foreground">
                {session?.user?.createdAt
                  ? new Date(session.user.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                  : 'Non disponible'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export des données
          </CardTitle>
          <CardDescription>
            Téléchargez une copie de toutes vos données personnelles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Télécharger vos données</h4>
            <p className="text-sm text-muted-foreground">
              Vous pouvez télécharger toutes vos données personnelles stockées dans Biume.
              Le fichier sera au format JSON et contiendra vos informations de profil,
              préférences et paramètres.
            </p>
          </div>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Note :</strong> L&apos;export inclut uniquement vos données personnelles.
              Les rapports et documents clients ne sont pas inclus pour des raisons de confidentialité.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleExportData}
            disabled={isLoading}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isLoading ? "Export en cours..." : "Télécharger mes données"}
          </Button>
        </CardContent>
      </Card>

      {/* Export des données organisationnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export des données organisationnelles
          </CardTitle>
          <CardDescription>
            Téléchargez une copie de vos clients et patients.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Télécharger vos données clients et patients</h4>
            <p className="text-sm text-muted-foreground">
              Vous pouvez télécharger toutes les données clients et patients de votre organisation.
              Le fichier contiendra les informations des clients, leurs animaux, et les types d&apos;animaux disponibles.
            </p>
          </div>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Note :</strong> Cet export inclut uniquement les données de votre organisation.
              Les rapports médicaux et documents détaillés ne sont pas inclus.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleExportOrganizationData}
            disabled={isLoading}
            className="gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            {isLoading ? "Export en cours..." : "Télécharger clients et patients"}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-300 bg-gradient-to-br from-red-50 to-red-100 shadow-lg py-0">
        <CardHeader className="bg-red-600/10 border-b border-red-200 py-6">
          <CardTitle className="flex items-center gap-2 text-red-800 text-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
            Zone de danger
          </CardTitle>
          <CardDescription className="text-red-700 font-medium">
            Actions irréversibles qui affectent définitivement votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-red-900 text-base">Supprimer le compte</h4>
            <p className="text-sm text-red-800 leading-relaxed">
              Supprimez définitivement votre compte et toutes les données associées.
              Cette action est irréversible et ne peut pas être annulée.
            </p>
          </div>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="lg"
              >
                <Trash2 className="h-5 w-5" />
                Supprimer le compte
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg border-red-200">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-red-800 text-xl font-bold flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  Supprimer le compte
                </DialogTitle>
                <DialogDescription className="text-red-700 text-base leading-relaxed">
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </DialogDescription>
              </DialogHeader>

              <Alert className="border-red-300 bg-red-50 shadow-sm">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong className="text-red-900">Attention :</strong> Cette action supprimera :
                  <ul className="mt-3 list-disc list-inside space-y-2 text-sm">
                    <li>Votre profil et toutes vos informations personnelles</li>
                    <li>Tous vos rapports et documents</li>
                    <li>L&apos;historique de vos transactions</li>
                    <li>Toutes les données associées à votre compte</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Form {...deleteForm}>
                <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="space-y-4">
                  <FormField
                    control={deleteForm.control}
                    name="confirmationText"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-red-800 font-semibold text-base">
                          Tapez <span className="bg-red-100 px-2 py-1 rounded font-mono text-red-900">SUPPRIMER</span> pour confirmer
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SUPPRIMER"
                            {...field}
                            disabled={isLoading}
                            className="border-red-300 focus:border-red-500 focus:ring-red-200 text-lg font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isLoading}
                      className="px-6"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={isLoading || deleteForm.watch("confirmationText") !== "SUPPRIMER"}
                      className="px-6 bg-red-600 hover:bg-red-700 font-semibold"
                    >
                      {isLoading ? "Suppression..." : "Supprimer définitivement"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTab;
