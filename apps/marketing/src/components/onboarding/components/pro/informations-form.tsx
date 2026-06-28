"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/style";
import { proBasicInformationsSchema } from "../../types/onboarding-schemas";
import { useMutation } from "@tanstack/react-query";
import { createOrganization } from "@/lib/api/actions/organization.action";
import { useUploadThing } from "@/lib/utils/uploadthing";
import Image from "next/image";
import { Upload, X } from "lucide-react";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const InformationsForm = ({
  nextStep,
  previousStep,
}: {
  nextStep: () => void;
  previousStep: () => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof proBasicInformationsSchema>>({
    resolver: zodResolver(proBasicInformationsSchema),
    defaultValues: {
      logo: "",
      name: "",
      email: "",
      description: "",
    },
  });

  const { control, formState, watch, setValue } = form;

  // Surveiller la valeur du nom pour générer le slug en temps réel
  const nameValue = watch("name");

  // Générer le slug à partir du nom (même logique que dans l'action)
  const generatedSlug = useMemo(() => {
    if (!nameValue) return "";
    return nameValue.toLowerCase().replace(/\s+/g, "-");
  }, [nameValue]);

  // Configuration de l'upload d'images
  const { startUpload, isUploading } = useUploadThing("documentsUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        const url = res[0].ufsUrl;
        setPreviewUrl(url);
        setValue("logo", url);
        toast.success("Logo téléchargé avec succès");
      }
    },
    onUploadError: (error) => {
      console.error("Error uploading image", error);
      toast.error("Erreur lors du téléchargement de l'image");
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Vérifier le type de fichier
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Type de fichier non supporté. Utilisez JPG, PNG ou WebP.");
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux. Taille maximale : 5MB.");
        return;
      }

      try {
        await startUpload([file]);
      } catch (error) {
        console.error("Error uploading image", error);
        toast.error("Erreur lors du téléchargement de l'image");
      }
    }
  };

  const removeLogo = () => {
    setPreviewUrl(null);
    setValue("logo", "");
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      toast.success("Informations sauvegardées !");
      nextStep();
    },
    onError: () => {
      toast.error("Une erreur est survenue");
    },
  });

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      await mutateAsync(form.getValues());
    } catch (error) {
      console.log(error, "error");
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Form {...form}>
        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Section logo et informations de base en colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 w-full">
              {/* Colonne logo */}
              <div className="flex flex-col items-start w-full md:col-span-1">
                <FormField
                  control={control}
                  name="logo"
                  render={() => (
                    <>
                      <label className="text-sm font-medium mb-2 block">
                        Logo de votre entreprise
                      </label>
                      <div className="relative w-32 h-32">
                        {previewUrl ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={previewUrl}
                              alt="Logo preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeLogo}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label
                            className={cn(
                              "w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors",
                              formState.errors.logo
                                ? "border-red-500"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50",
                            )}
                          >
                            <Input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES.join(",")}
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={isUploading}
                            />
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground text-center px-2">
                              {isUploading
                                ? "Téléchargement..."
                                : "Ajouter un logo"}
                            </span>
                          </label>
                        )}
                      </div>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Formats acceptés : JPG, PNG, WebP (max 5MB)
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Colonne informations */}
              <div className="flex flex-col items-start w-full md:col-span-2 gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm font-medium">
                        Nom de votre entreprise
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          placeholder="John Doe Inc."
                          {...field}
                          value={field.value ?? ""}
                          className={cn(
                            "h-10 text-base w-full",
                            formState.errors.name && "border-destructive",
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Champ slug en lecture seule */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Identifiant de votre entreprise (généré automatiquement)
                  </label>
                  <Input
                    type="text"
                    value={generatedSlug}
                    readOnly
                    disabled
                    placeholder="john-doe-inc"
                    className="h-10 text-base bg-muted/50 text-muted-foreground cursor-not-allowed mt-1"
                  />
                </div>
              </div>
            </div>

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium">
                    Email de contact
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@john-doe-inc.com"
                      {...field}
                      value={field.value ?? ""}
                      className={cn(
                        "h-10 text-base",
                        formState.errors.email && "border-destructive",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem className="mb-4 w-full">
                  <FormLabel className="text-sm font-medium">
                    Description de votre entreprise
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className={cn(
                        "resize-none text-base",
                        formState.errors.description && "border-destructive",
                      )}
                      placeholder="Décrivez votre activité, vos services et ce qui vous rend unique..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Footer fixe */}
        <div className="px-4 py-2">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={previousStep}
              disabled={isPending}
            >
              ← Précédent
            </Button>

            <Button type="submit" disabled={isPending} onClick={onSubmit}>
              {isPending ? "En cours..." : "Continuer →"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default InformationsForm;
