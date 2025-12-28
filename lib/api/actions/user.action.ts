"use server";

import { auth } from "@/lib/auth/auth-server";
import { db } from "@/lib/utils/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  user as userSchema,
  member as memberSchema,
  clients,
  pets,
  animals,
  organization,
} from "@/lib/schemas";
import { z } from "zod";

const updateUserProfileSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(120),
  phoneNumber: z.string().max(40).optional().nullable(),
  lang: z.enum(["fr", "en"]).default("fr"),
  image: z.string().url().optional().or(z.literal("")).or(z.null()),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
});

const updateUserNotificationsSchema = z.object({
  emailNotifications: z.boolean(),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
      .max(128, "Le nouveau mot de passe ne peut pas dépasser 128 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les nouveaux mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const updateUserNotifications = async (
  input: z.infer<typeof updateUserNotificationsSchema>,
) => {
  try {
    const parsedInput = updateUserNotificationsSchema.parse(input);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    const [updatedUser] = await db
      .update(userSchema)
      .set({
        emailNotifications: parsedInput.emailNotifications,
        updatedAt: new Date(),
      })
      .where(eq(userSchema.id, session.user.id))
      .returning();

    if (!updatedUser) {
      throw new Error("Impossible de mettre à jour les préférences");
    }

    revalidatePath("/dashboard/settings");

    return updatedUser;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications:", error);
    throw new Error(
      "Erreur lors de la mise à jour des préférences de notifications",
    );
  }
};

export const changePassword = async (
  input: z.infer<typeof changePasswordSchema>,
) => {
  try {
    const parsedInput = changePasswordSchema.parse(input);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Vérifier le mot de passe actuel
    const result = await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsedInput.currentPassword,
        newPassword: parsedInput.newPassword,
      },
    });

    if (!result) {
      throw new Error("Impossible de changer le mot de passe");
    }

    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    throw new Error("Erreur lors du changement de mot de passe");
  }
};

export const updateUserProfile = async (
  input: z.infer<typeof updateUserProfileSchema>,
) => {
  try {
    const parsed = updateUserProfileSchema.parse(input);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    const [updated] = await db
      .update(userSchema)
      .set({
        name: parsed.name,
        phoneNumber: parsed.phoneNumber ?? "",
        lang: parsed.lang,
        image: parsed.image ?? "",
        emailNotifications:
          typeof parsed.emailNotifications === "boolean"
            ? parsed.emailNotifications
            : undefined,
        smsNotifications:
          typeof parsed.smsNotifications === "boolean"
            ? parsed.smsNotifications
            : undefined,
        updatedAt: new Date(),
      })
      .where(eq(userSchema.id, session.user.id))
      .returning();

    if (!updated) {
      throw new Error("Impossible de mettre à jour le profil");
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return updated;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    throw new Error("Erreur lors de la mise à jour du profil");
  }
};

const deleteAccountSchema = z.object({
  confirmationText: z
    .string()
    .refine(
      (text) => text === "SUPPRIMER",
      "Vous devez taper 'SUPPRIMER' pour confirmer la suppression",
    ),
});

export const deleteAccount = async (
  input: z.infer<typeof deleteAccountSchema>,
) => {
  try {
    deleteAccountSchema.parse(input);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Supprimer l'utilisateur de la base de données
    await db.delete(userSchema).where(eq(userSchema.id, session.user.id));

    // Déconnexion de l'utilisateur
    await auth.api.signOut({
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    throw new Error("Erreur lors de la suppression du compte");
  }
};

export const exportUserData = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Récupérer toutes les données de l'utilisateur
    const userData = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, session.user.id))
      .limit(1);

    if (!userData.length) {
      throw new Error("Utilisateur non trouvé");
    }

    // Créer l'objet d'export avec toutes les données
    const exportData = {
      user: {
        id: userData[0].id,
        email: userData[0].email,
        name: userData[0].name,
        createdAt: userData[0].createdAt,
        updatedAt: userData[0].updatedAt,
        emailNotifications: userData[0].emailNotifications,
        // Ne pas inclure les données sensibles comme les mots de passe
      },
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    return exportData;
  } catch (error) {
    console.error("Erreur lors de l'export des données:", error);
    throw new Error("Erreur lors de l'export des données");
  }
};

export const exportOrganizationData = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Récupérer l'organisation de l'utilisateur
    const userMemberships = await db
      .select({
        organizationId: memberSchema.organizationId,
        organizationName: organization.name,
        role: memberSchema.role,
      })
      .from(memberSchema)
      .leftJoin(organization, eq(memberSchema.organizationId, organization.id))
      .where(eq(memberSchema.userId, session.user.id));

    if (!userMemberships.length) {
      throw new Error("Aucune organisation trouvée pour cet utilisateur");
    }

    // Utiliser la première organisation trouvée (un utilisateur peut appartenir à plusieurs organisations)
    const organizationId = userMemberships[0].organizationId;

    // Récupérer les clients de l'organisation
    const organizationClients = await db
      .select()
      .from(clients)
      .where(eq(clients.organizationId, organizationId));

    // Récupérer les animaux pour la référence des types
    const animalTypes = await db.select().from(animals);

    // Récupérer les pets de l'organisation
    const organizationPets = await db
      .select({
        id: pets.id,
        name: pets.name,
        type: pets.type,
        weight: pets.weight,
        height: pets.height,
        description: pets.description,
        ownerId: pets.ownerId,
        breed: pets.breed,
        image: pets.image,
        chippedNumber: pets.chippedNumber,
        gender: pets.gender,
        nacType: pets.nacType,
        birthDate: pets.birthDate,
        deseases: pets.deseases,
        allergies: pets.allergies,
        intolerences: pets.intolerences,
        organizationId: pets.organizationId,
        createdAt: pets.createdAt,
        updatedAt: pets.updatedAt,
        // Ajouter les informations du propriétaire et du type d'animal
        ownerName: clients.name,
        ownerEmail: clients.email,
        animalType: animals.name,
      })
      .from(pets)
      .leftJoin(clients, eq(pets.ownerId, clients.id))
      .leftJoin(animals, eq(pets.type, animals.id))
      .where(eq(pets.organizationId, organizationId));

    // Créer l'objet d'export avec toutes les données
    const exportData = {
      organization: {
        id: organizationId,
        name: userMemberships[0].organizationName,
        role: userMemberships[0].role,
      },
      clients: organizationClients.map((client) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        state: client.state,
        zip: client.zip,
        country: client.country,
        image: client.image,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      })),
      pets: organizationPets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        type: pet.animalType,
        weight: pet.weight,
        height: pet.height,
        description: pet.description,
        ownerName: pet.ownerName,
        ownerEmail: pet.ownerEmail,
        breed: pet.breed,
        image: pet.image,
        chippedNumber: pet.chippedNumber,
        gender: pet.gender,
        nacType: pet.nacType,
        birthDate: pet.birthDate,
        deseases: pet.deseases,
        allergies: pet.allergies,
        intolerences: pet.intolerences,
        createdAt: pet.createdAt,
        updatedAt: pet.updatedAt,
      })),
      animalTypes: animalTypes.map((animal) => ({
        id: animal.id,
        name: animal.name,
        code: animal.code || "",
      })),
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    return exportData;
  } catch (error) {
    console.error("Erreur lors de l'export des données organisation:", error);
    throw new Error("Erreur lors de l'export des données organisation");
  }
};
