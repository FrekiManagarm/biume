"use server";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/utils/db";
import {
  MedicalDocument,
  medicalDocuments,
  CreateMedicalDocument,
} from "@/lib/schemas/medicalDocuments";
import { getCurrentOrganization } from "./auth.action";
import { pets } from "@/lib/schemas/pets";
import { auth } from "@/lib/auth/auth-server";

export async function getMedicalDocumentsByPetId(petId: string) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  // Vérifier que le pet appartient à l'organisation
  const pet = await db.query.pets.findFirst({
    where: and(eq(pets.id, petId), eq(pets.organizationId, organization.id)),
  });

  if (!pet) {
    throw new Error("Pet not found or access denied");
  }

  const documents = await db.query.medicalDocuments.findMany({
    where: eq(medicalDocuments.petId, petId),
    orderBy: [desc(medicalDocuments.createdAt)],
    with: {
      uploader: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return documents;
}

export async function createMedicalDocument(
  data: Omit<CreateMedicalDocument, "uploadedBy">,
) {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  // Vérifier que le pet appartient à l'organisation
  const pet = await db.query.pets.findFirst({
    where: and(
      eq(pets.id, data.petId),
      eq(pets.organizationId, organization.id),
    ),
  });

  if (!pet) {
    throw new Error("Pet not found or access denied");
  }

  const [document] = await db
    .insert(medicalDocuments)
    .values({
      ...data,
      uploadedBy: session.user.id,
      updatedAt: new Date(),
    })
    .returning();

  return document;
}

export async function deleteMedicalDocument(documentId: string) {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  // Vérifier que le document appartient à un pet de l'organisation
  const document = await db.query.medicalDocuments.findFirst({
    where: eq(medicalDocuments.id, documentId),
    with: {
      pet: true,
    },
  });

  if (!document || document.pet?.organizationId !== organization.id) {
    throw new Error("Document not found or access denied");
  }

  await db.delete(medicalDocuments).where(eq(medicalDocuments.id, documentId));

  return { success: true };
}

export async function updateMedicalDocument(
  documentId: string,
  data: Partial<Pick<MedicalDocument, "title" | "description" | "fileType">>,
) {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  // Vérifier que le document appartient à un pet de l'organisation
  const document = await db.query.medicalDocuments.findFirst({
    where: eq(medicalDocuments.id, documentId),
    with: {
      pet: true,
    },
  });

  if (!document || document.pet?.organizationId !== organization.id) {
    throw new Error("Document not found or access denied");
  }

  const [updated] = await db
    .update(medicalDocuments)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(medicalDocuments.id, documentId))
    .returning();

  return updated;
}
