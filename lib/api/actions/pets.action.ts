"use server";

import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/utils/db";
import { CreatePetSchema, Pet, pets } from "@/lib/schemas/pets";
import { getCurrentOrganization } from "./auth.action";
import z from "zod";

export type GetAllPetsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function getAllPets(params: GetAllPetsParams = {}) {
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

  const offset = Math.max(0, (page - 1) * limit);

  const rows = await db.query.pets.findMany({
    where,
    orderBy: [desc(pets.createdAt)],
    with: {
      owner: true,
      animal: true,
    },
    limit,
    offset,
  });

  return rows as Pet[];
}

export async function createPet(data: z.infer<typeof CreatePetSchema>) {
  try {
    const validatedData = CreatePetSchema.parse(data);

    const organization = await getCurrentOrganization();

    if (!organization) {
      throw new Error("Organization not found");
    }

    const now = new Date();

    const [pet] = await db
      .insert(pets)
      .values({
        ...validatedData,
        organizationId: organization.id,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return pet;
  } catch (error) {
    console.error("Error creating pet", error);
    throw new Error("Error creating pet");
  }
}

export async function updatePet(
  data: z.infer<typeof CreatePetSchema>,
  id: string,
) {
  try {
    const validatedData = CreatePetSchema.parse(data);

    const organization = await getCurrentOrganization();
    if (!organization) throw new Error("Organization not found");

    const now = new Date();

    // Vérifier que le pet appartient bien à l'organisation
    const existingPet = await db.query.pets.findFirst({
      where: and(
        eq(pets.id, id as string),
        eq(pets.organizationId, organization.id),
      ),
    });

    if (!existingPet) {
      throw new Error("Pet not found or unauthorized");
    }

    await db
      .update(pets)
      .set({
        ...validatedData,
        updatedAt: now,
      })
      .where(eq(pets.id, id as string));

    return { id };
  } catch (error) {
    console.error("Error updating pet", error);
    throw new Error("Error updating pet");
  }
}
