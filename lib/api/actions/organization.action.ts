"use server";

import { organizationImagesFormSchema } from "@/components/dashboard/pages/settings/components/profile/profile-logo-section";
import { auth } from "@/lib/auth/auth-server";
import {
  CreateOrganizationSchema,
  Organization,
  organization as organizationSchema,
} from "@/lib/schemas";
import { db } from "@/lib/utils/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { getCurrentOrganization, getUser } from "./auth.action";

export const createOrganization = async (
  input: z.infer<typeof CreateOrganizationSchema>,
) => {
  try {
    const data = CreateOrganizationSchema.parse(input);

    console.log(data, "data");

    const user = await getUser();

    if (!user) {
      throw new Error("User not found");
    }

    const result = await auth.api.createOrganization({
      body: {
        name: data.name as string,
        slug: data.name?.toLowerCase().replace(/\s+/g, "-") as string,
        logo: data.logo as string,
        metadata: {},
        userId: user.user?.id as string,
        onBoardingComplete: false,
        description: data.description as string,
        email: data.email as string,
        keepCurrentActiveOrganization: false,
      },
    });

    if (!result) {
      throw new Error("Organization not created");
    }

    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationId: result?.id,
      },
    });

    // Retourner les données de l'organisation créée
    return result;
  } catch (error) {
    console.error("Erreur lors de la création de l'organisation:", error);
    throw new Error("Impossible de créer l'organisation");
  }
};

export const updateOrganization = async (
  input: z.infer<typeof CreateOrganizationSchema>,
) => {
  const parsedInput = CreateOrganizationSchema.omit({ name: true }).parse(
    input,
  );
  try {
    const organization = await getCurrentOrganization();

    if (!organization) {
      throw new Error("Organization not found");
    }

    const [data] = await db
      .update(organizationSchema)
      .set(parsedInput)
      .where(eq(organizationSchema.id, organization.id as string))
      .returning();

    if (!data) {
      throw new Error("Organization not updated");
    }

    revalidatePath("/dashboard/settings");

    return data as Organization;
  } catch (error) {
    console.error("Error updating organization", error);
    throw new Error("Error updating organization");
  }
};

export const updateOrganizationImages = async (
  input: z.infer<typeof organizationImagesFormSchema>,
) => {
  const parsedInput = organizationImagesFormSchema.parse(input);

  const organization = await getCurrentOrganization();

  if (!organization) {
    throw new Error("Organization not found");
  }

  const data = await db
    .update(organizationSchema)
    .set({
      logo: parsedInput.logo,
    })
    .where(eq(organizationSchema.id, organization.id as string))
    .returning()
    .execute();

  if (!data) {
    const data = await db
      .update(organizationSchema)
      .set({
        logo: parsedInput.logo,
      })
      .where(eq(organizationSchema.id, organization.id as string))
      .returning()
      .execute();

    if (!data) {
      throw new Error("Organization not updated");
    }

    revalidatePath(`/dashboard/settings`);

    return data;
  }
};

export const handleChangeOrganization = async (orgId: string) => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("User not found");
    }

    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationId: orgId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/api/autumn");
  } catch (error) {
    console.error("Error changing organization:", error);
    throw new Error("Failed to change organization");
  }
};

export const completeOnboarding = async (orgId: string) => {
  try {
    const organization = await getCurrentOrganization();

    if (!organization) {
      throw new Error("Organization not found");
    }

    const [org] = await db
      .update(organizationSchema)
      .set({
        onBoardingComplete: true,
      })
      .where(eq(organizationSchema.id, orgId as string))
      .returning()
      .execute();

    if (!org) {
      throw new Error("Failed to complete onboarding");
    }

    revalidatePath("/dashboard");

    return org;
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }
};

export const completeOnboardingExplications = async (orgId: string) => {
  try {
    const organization = await getCurrentOrganization();

    if (!organization) {
      throw new Error("Organization not found");
    }

    const [org] = await db
      .update(organizationSchema)
      .set({
        onBoardingExplications: true,
      })
      .where(eq(organizationSchema.id, orgId as string))
      .returning()
      .execute();

    if (!org) {
      throw new Error("Failed to complete onboarding explications");
    }

    revalidatePath("/dashboard");

    return org;
  } catch (error) {
    console.error("Error completing onboarding explications:", error);
    throw new Error("Failed to complete onboarding explications");
  }
};

export const setActiveOrganization = async (orgId: string) => {
  try {
    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationId: orgId,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error setting active organization:", error);
    throw new Error("Failed to set active organization");
  }
};

export const createNewOrganization = async () => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("User not found");
    }

    // Créer une organisation par défaut
    const result = await auth.api.createOrganization({
      body: {
        name: `Organisation de ${user.user?.name || "Utilisateur"}`,
        slug: `org-${user.user?.id}`,
        logo: "",
        metadata: {},
        userId: user.user?.id as string,
        keepCurrentActiveOrganization: false,
      },
    });

    if (!result) {
      throw new Error("Organization not created");
    }

    // Mettre à jour l'organisation avec des valeurs par défaut
    await db
      .update(organizationSchema)
      .set({
        email: user.user?.email || "",
        description: "Organisation créée automatiquement",
      })
      .where(eq(organizationSchema.id, result?.id as string))
      .returning()
      .execute();

    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationId: result?.id,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error creating new organization:", error);
    throw new Error("Failed to create new organization");
  }
};
