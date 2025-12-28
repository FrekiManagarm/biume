"use client";

import { Input } from "@/components/ui/input";
import { updateOrganizationImages } from "@/lib/api/actions/organization.action";
import { CreateOrganizationSchema, Organization } from "@/lib/schemas";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

interface ProfileCoverSectionProps {
  org: Organization | null | undefined;
  form: UseFormReturn<z.infer<typeof CreateOrganizationSchema>>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  isDirty: boolean;
}

export const organizationImagesFormSchema = z.object({
  logo: z.string().optional(),
});

const ProfileLogoSection = ({
  org,
  onSubmit,
  isPending,
  isDirty,
}: ProfileCoverSectionProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    org?.logo || null,
  );

  const { mutateAsync: updateImages } = useMutation({
    mutationFn: updateOrganizationImages,
    onSuccess: () => {
      toast.success("Image mise à jour avec succès");
    },
    onError: (error) => {
      console.error("Error updating images", error);
      toast.error(error.message);
    },
  });

  const { startUpload, isUploading } = useUploadThing("documentsUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        const url = res[0].ufsUrl;
        if (isUploading) {
          setPreviewUrl(url);
          await updateImages({ logo: url });
        }
      }
    },
    onUploadError: (error) => {
      console.error("Error uploading image", error);
      toast.error(error.message);
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        await startUpload([file]);
      } catch (error) {
        console.error("Error uploading image", error);
        toast.error("Erreur lors du téléchargement de l'image");
      }
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative w-32 h-32">
          <div className="w-full h-full rounded-full shadow-lg">
            {previewUrl || org?.logo ? (
              <Image
                src={previewUrl || org?.logo || ""}
                alt="Logo"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-full border border-muted">
                <p className="text-sm text-muted-foreground text-center px-4">
                  Ajoutez votre logo
                </p>
              </div>
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full">
            <Input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleImageChange}
              className="hidden rounded-full"
              disabled={isUploading}
            />
            <p className="text-white text-xs font-medium">Modifier le logo</p>
          </label>
        </div>
        <div className="ml-8">
          <h2 className="text-xl font-semibold">
            {org?.name || "Votre entreprise"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personnalisez votre profil professionnel
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isPending || !isDirty} onClick={onSubmit}>
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
};

export default ProfileLogoSection;
