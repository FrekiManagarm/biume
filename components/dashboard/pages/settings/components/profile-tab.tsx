import { Form } from "@/components/ui/form";
import { CreateOrganizationSchema, Organization } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import ProfileLogoSection from "./profile/profile-logo-section";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrganization } from "@/lib/api/actions/organization.action";
import { ProfileAiSection } from "./profile/profile-ai-section";
import { ProfileDataImportSection } from "./profile/profile-data-import-section";
import ProfileMainSection from "./profile/profile-main-section";

const ProfileTab = ({ org }: { org: Organization }) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof CreateOrganizationSchema>>({
    resolver: zodResolver(CreateOrganizationSchema),
    values: {
      name: org?.name || "",
      email: org?.email || "",
      description: org?.description || "",
      lang: org?.lang || "fr",
      slug: org?.slug || "",
      ai: org?.ai || false,
    },
  });

  const { handleSubmit, formState } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-profile"] });
      toast.success("Modifications enregistrées avec succès !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync({
      ...data,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="relative w-full">
          <ProfileLogoSection
            org={org}
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            isDirty={formState.isDirty}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 w-full">
            <div className="md:col-span-2 space-y-6">
              <ProfileMainSection form={form} />
            </div>
            <div className="space-y-6">
              <ProfileAiSection org={org} form={form} />
              <ProfileDataImportSection />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileTab;
