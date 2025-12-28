import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateOrganizationSchema } from "@/lib/schemas/organization";
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface ProfileMainInfoSectionProps {
  form: UseFormReturn<z.infer<typeof CreateOrganizationSchema>>;
}

const ProfileMainSection = ({ form }: ProfileMainInfoSectionProps) => {
  // Fonction pour générer un slug à partir du nom
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/[^a-z0-9\s-]/g, "") // Garde seulement lettres, chiffres, espaces et tirets
      .replace(/\s+/g, "-") // Remplace les espaces par des tirets
      .replace(/-+/g, "-") // Remplace les tirets multiples par un seul
      .trim();
  };

  // Surveiller les changements du nom pour mettre à jour le slug
  const nameValue = form.watch("name");
  useEffect(() => {
    if (nameValue) {
      const newSlug = generateSlug(nameValue);
      form.setValue("slug", newSlug, { shouldDirty: true });
    }
  }, [nameValue, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations principales</CardTitle>
        <CardDescription>
          Les informations essentielles de votre activité.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de votre entreprise</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Entrez le nom de votre entreprise"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identifiant unique (slug)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="votre-entreprise"
                    readOnly
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de contact</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    value={field.value ?? ""}
                    placeholder="contact@votre-entreprise.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Langue</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description de votre activité</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Décrivez votre activité de thérapeute animalier..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileMainSection;
