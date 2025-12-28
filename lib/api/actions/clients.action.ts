"use server";

import { and, desc, ilike, or, eq } from "drizzle-orm";
import { db } from "@/lib/utils/db";
import { Client, clients } from "@/lib/schemas/clients";
import { getCurrentOrganization } from "./auth.action";
import { clientSchema, ClientSchema } from "@/lib/utils/schemas";
import { pets } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export type GetAllClientsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function getAllClients(params: GetAllClientsParams = {}) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  const { search = "", page = 1, limit = 10 } = params;
  const baseCondition = eq(clients.organizationId, organization.id);
  const where =
    search.trim().length > 0
      ? and(
        baseCondition,
        or(
          ilike(clients.name, `%${search.trim().toLowerCase()}%`),
          ilike(clients.email, `%${search.trim().toLowerCase()}%`),
          ilike(clients.phone, `%${search.trim().toLowerCase()}%`),
          ilike(clients.address, `%${search.trim().toLowerCase()}%`),
          ilike(clients.city, `%${search.trim().toLowerCase()}%`),
        ),
      )
      : and(baseCondition);

  const offset = Math.max(0, (page - 1) * limit);

  const rows = await db.query.clients.findMany({
    where,
    orderBy: [desc(clients.createdAt)],
    with: {
      pets: {
        columns: {
          id: true,
          name: true,
        },
        with: {
          animal: true,
        },
      },
    },
    limit,
    offset,
  });

  return rows as Client[];
}

export type CreateClientInput = Omit<
  typeof clients.$inferInsert,
  "id" | "organizationId" | "createdAt" | "updatedAt"
> & {
  // Tous les champs optionnels sont déjà définis dans le schéma Drizzle
};

export async function createClient(data: ClientSchema) {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) throw new Error("Organization not found");

    const parsedInput = clientSchema.parse(data);

    const [user] = await db
      .insert(clients)
      .values({
        name: parsedInput.name,
        email: parsedInput.email,
        phone: parsedInput.phoneNumber,
        address: "",
        city: parsedInput.city,
        country: parsedInput.country,
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .execute();

    const petsData = await db
      .insert(pets)
      .values(
        parsedInput.pets.map((pet) => ({
          ...pet,
          ownerId: user.id,
          organizationId: organization.id,
        })),
      )
      .returning()
      .execute();

    revalidatePath(`/dashboard/clients`);

    return {
      user,
      pets: petsData,
      client: user,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Une erreur est survenue lors de la création du client");
  }
}

export type UpdateClientInput = Omit<
  typeof clients.$inferInsert,
  "id" | "organizationId" | "createdAt" | "updatedAt"
> & {
  id: string;
};

export async function updateClient(data: UpdateClientInput) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  const now = new Date();

  // Vérifier que le client appartient bien à l'organisation
  const existingClient = await db.query.clients.findFirst({
    where: and(
      eq(clients.id, data.id),
      eq(clients.organizationId, organization.id),
    ),
  });

  if (!existingClient) {
    throw new Error("Client not found or unauthorized");
  }

  await db
    .update(clients)
    .set({
      name: data.name ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      zip: data.zip ?? null,
      country: data.country ?? null,
      updatedAt: now,
    })
    .where(eq(clients.id, data.id));

  return { id: data.id };
}
