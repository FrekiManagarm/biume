"use server";

import { and, desc, ilike, or, eq } from "drizzle-orm";
import { db } from "@/lib/utils/db";
import { Pet, pets } from "@/lib/schemas/pets";
import { getCurrentOrganization } from "./auth.action";

export type GetAllPatientsParams = {
  search?: string;
  type?: string; // Chien/Chat/... via UI, ici filtrage simple par race/nom/proprio
  page?: number;
  limit?: number;
};

export async function getAllPatients(params: GetAllPatientsParams = {}) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  const { search = "", page = 1, limit = 10 } = params;

  const baseCondition = eq(pets.organizationId, organization.id);
  const where =
    search.trim().length > 0
      ? and(
          baseCondition,
          or(
            ilike(pets.name, `%${search.trim().toLowerCase()}%`),
            ilike(pets.breed, `%${search.trim().toLowerCase()}%`),
          ),
        )
      : and(baseCondition);

  // Filtre type via 'animals' referencé dans pets.type? Ici on reste simple et on compare breed/name
  // Un mapping plus riche pourrait rejoindre la table animals si nécessaire

  const offset = Math.max(0, (page - 1) * limit);

  const rows = await db.query.pets.findMany({
    where,
    orderBy: [desc(pets.createdAt)],
    with: {
      owner: true,
      animal: true,
      advancedReport: true,
    },
    limit,
    offset,
  });

  return rows;
}

export async function getPatientById(id: string) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  const patient = await db.query.pets.findFirst({
    where: and(eq(pets.id, id), eq(pets.organizationId, organization.id)),
    with: {
      owner: true,
      animal: true,
      advancedReport: true,
      organization: true,
    },
  });

  return patient as unknown as Pet;
}

export async function deletePatient(id: string) {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) throw new Error("Organization not found");

    await db
      .delete(pets)
      .where(and(eq(pets.id, id), eq(pets.organizationId, organization.id)));
  } catch (error) {
    console.error("Error deleting patient", error);
    throw new Error("Error deleting patient");
  }
}

export async function updatePatientAllergies(
  allergies: string[],
  petId: string,
) {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) throw new Error("Organization not found");

    const [updatedPet] = await db
      .update(pets)
      .set({
        allergies: allergies,
        updatedAt: new Date(),
      })
      .where(and(eq(pets.id, petId), eq(pets.organizationId, organization.id)))
      .returning()
      .execute();

    return updatedPet as unknown as Pet;
  } catch (error) {
    console.error("Error updating patient allergies", error);
    throw new Error("Error updating patient allergies");
  }
}

export async function updatePatientDeseases(deseases: string[], petId: string) {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) throw new Error("Organization not found");

    const [updatedPet] = await db
      .update(pets)
      .set({
        deseases: deseases,
        updatedAt: new Date(),
      })
      .where(and(eq(pets.id, petId), eq(pets.organizationId, organization.id)))
      .returning()
      .execute();

    return updatedPet as unknown as Pet;
  } catch (error) {
    console.error("Error updating patient deseases", error);
    throw new Error("Error updating patient deseases");
  }
}

export async function updatePetIntolerences(
  intolerences: string[],
  petId: string,
) {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) throw new Error("Organization not found");

    const [updatedPet] = await db
      .update(pets)
      .set({
        intolerences: intolerences,
        updatedAt: new Date(),
      })
      .where(and(eq(pets.id, petId), eq(pets.organizationId, organization.id)))
      .returning()
      .execute();

    return updatedPet as unknown as Pet;
  } catch (error) {
    console.error("Error updating patient intolerences", error);
    throw new Error("Error updating patient intolerences");
  }
}
