"use server";

import { db } from "@/lib/utils/db";
import { clients } from "@/lib/schemas/clients";
import { pets } from "@/lib/schemas/pets";
import { getCurrentOrganization } from "./auth.action";
import {
  ImportClientSchema,
  ImportPetSchema,
  ImportResult,
  ImportEntityType,
} from "@/lib/schemas/dataImport";
import { revalidatePath } from "next/cache";
import { z } from "zod";

interface ImportError {
  row: number;
  field?: string;
  message: string;
}

/**
 * Importe des clients depuis des données structurées
 */
export async function importClients(
  data: Array<Record<string, unknown>>,
): Promise<ImportResult> {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) {
      throw new Error("Organisation non trouvée");
    }

    const errors: ImportError[] = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < data.length; i++) {
      try {
        // Valider chaque ligne
        const validatedClient = ImportClientSchema.parse(data[i]);

        // Insérer le client
        await db.insert(clients).values({
          name: validatedClient.name,
          email: validatedClient.email || null,
          phone: validatedClient.phone || null,
          address: validatedClient.address || null,
          city: validatedClient.city || null,
          state: validatedClient.state || null,
          zip: validatedClient.zip || null,
          country: validatedClient.country || null,
          organizationId: organization.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        successCount++;
      } catch (error) {
        failedCount++;
        if (error instanceof z.ZodError) {
          const zodError = error as z.ZodError;
          errors.push({
            row: i + 1,
            field: zodError.issues[0]?.path.join("."),
            message: zodError.issues[0]?.message || "Erreur de validation",
          });
        } else {
          errors.push({
            row: i + 1,
            message:
              error instanceof Error
                ? error.message
                : "Erreur lors de l'import",
          });
        }
      }
    }

    revalidatePath("/dashboard/clients");

    return {
      success: errors.length === 0,
      imported: successCount,
      failed: failedCount,
      errors,
      data: {
        clients: successCount,
        pets: 0,
      },
    };
  } catch (error) {
    console.error("Erreur lors de l'import des clients:", error);
    throw new Error("Une erreur est survenue lors de l'import des clients");
  }
}

/**
 * Importe des animaux depuis des données structurées
 */
export async function importPets(
  data: Array<Record<string, unknown>>,
): Promise<ImportResult> {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) {
      throw new Error("Organisation non trouvée");
    }

    const errors: ImportError[] = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < data.length; i++) {
      try {
        // Valider chaque ligne
        const validatedPet = ImportPetSchema.parse(data[i]);

        // Rechercher le propriétaire si email ou nom fourni
        let ownerId: string | null = null;
        if (validatedPet.ownerEmail) {
          const owner = await db.query.clients.findFirst({
            where: (clientsTable, { eq, and }) =>
              and(
                eq(clientsTable.email, validatedPet.ownerEmail!),
                eq(clientsTable.organizationId, organization.id),
              ),
          });
          ownerId = owner?.id || null;
        } else if (validatedPet.ownerName) {
          const owner = await db.query.clients.findFirst({
            where: (clientsTable, { ilike, and, eq }) =>
              and(
                ilike(clientsTable.name, `%${validatedPet.ownerName}%`),
                eq(clientsTable.organizationId, organization.id),
              ),
          });
          ownerId = owner?.id || null;
        }

        // Rechercher le type d'animal (si fourni par nom)
        let animalTypeId: string | null = validatedPet.type || null;
        if (validatedPet.type && validatedPet.type.length < 36) {
          // Si ce n'est pas un UUID, chercher par nom
          const animal = await db.query.animals.findFirst({
            where: (animals, { ilike }) =>
              ilike(animals.name, validatedPet.type!),
          });
          animalTypeId = animal?.id || null;
        }

        // Insérer l'animal
        await db.insert(pets).values({
          name: validatedPet.name,
          type: animalTypeId,
          breed: validatedPet.breed,
          weight: validatedPet.weight,
          height: validatedPet.height,
          description: validatedPet.description || null,
          gender: validatedPet.gender,
          birthDate: validatedPet.birthDate,
          chippedNumber: validatedPet.chippedNumber || null,
          nacType: validatedPet.nacType || null,
          deseases: validatedPet.deseases || null,
          allergies: validatedPet.allergies || null,
          intolerences: validatedPet.intolerences || null,
          ownerId,
          organizationId: organization.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        successCount++;
      } catch (error) {
        failedCount++;
        if (error instanceof z.ZodError) {
          const zodError = error as z.ZodError;
          errors.push({
            row: i + 1,
            field: zodError.issues[0]?.path.join("."),
            message: zodError.issues[0]?.message || "Erreur de validation",
          });
        } else {
          errors.push({
            row: i + 1,
            message:
              error instanceof Error
                ? error.message
                : "Erreur lors de l'import",
          });
        }
      }
    }

    revalidatePath("/dashboard/pets");

    return {
      success: errors.length === 0,
      imported: successCount,
      failed: failedCount,
      errors,
      data: {
        clients: 0,
        pets: successCount,
      },
    };
  } catch (error) {
    console.error("Erreur lors de l'import des animaux:", error);
    throw new Error("Une erreur est survenue lors de l'import des animaux");
  }
}

/**
 * Importe des données (clients et/ou animaux) selon le type
 */
export async function importData(
  entityType: ImportEntityType,
  data: Array<Record<string, unknown>>,
): Promise<ImportResult> {
  try {
    switch (entityType) {
      case "clients":
        return await importClients(data);
      case "pets":
        return await importPets(data);
      case "both":
        // Import combiné : d'abord les clients, puis les animaux
        const clientsResult = await importClients(
          data.map((row) => ({
            name: row.clientName || row.name,
            email: row.clientEmail || row.email,
            phone: row.clientPhone || row.phone,
            address: row.clientAddress || row.address,
            city: row.clientCity || row.city,
            state: row.clientState || row.state,
            zip: row.clientZip || row.zip,
            country: row.clientCountry || row.country,
          })),
        );

        const petsResult = await importPets(
          data
            .filter((row) => row.petName) // Seulement les lignes avec un animal
            .map((row) => ({
              name: row.petName,
              type: row.petType,
              breed: row.petBreed,
              weight: row.petWeight,
              height: row.petHeight,
              description: row.petDescription,
              gender: row.petGender,
              birthDate: row.petBirthDate,
              chippedNumber: row.petChippedNumber,
              nacType: row.petNacType,
              deseases: row.petDeseases,
              allergies: row.petAllergies,
              intolerences: row.petIntolerences,
              ownerEmail: row.clientEmail || row.email,
            })),
        );

        return {
          success: clientsResult.success && petsResult.success,
          imported: clientsResult.imported + petsResult.imported,
          failed: clientsResult.failed + petsResult.failed,
          errors: [...clientsResult.errors, ...petsResult.errors],
          data: {
            clients: clientsResult.data.clients,
            pets: petsResult.data.pets,
          },
        };
      default:
        throw new Error("Type d'entité non supporté");
    }
  } catch (error) {
    console.error("Erreur lors de l'import des données:", error);
    throw new Error("Une erreur est survenue lors de l'import des données");
  }
}

/**
 * Parse un fichier CSV en tableau d'objets
 */
export async function parseCSV(
  csvContent: string,
): Promise<Array<Record<string, unknown>>> {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) {
    throw new Error(
      "Le fichier CSV doit contenir au moins une ligne d'en-tête et une ligne de données",
    );
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const data: Array<Record<string, unknown>> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      const value = values[index];
      // Conversion automatique des types
      if (value === "") {
        row[header] = null;
      } else if (!isNaN(Number(value))) {
        row[header] = Number(value);
      } else if (
        value.toLowerCase() === "true" ||
        value.toLowerCase() === "false"
      ) {
        row[header] = value.toLowerCase() === "true";
      } else {
        row[header] = value;
      }
    });

    data.push(row);
  }

  return data;
}

/**
 * Valide la structure des données avant import
 */
export async function validateImportData(
  entityType: ImportEntityType,
  data: Array<Record<string, unknown>>,
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (!data || data.length === 0) {
    errors.push("Aucune donnée à importer");
    return { valid: false, errors };
  }

  // Validation selon le type
  if (entityType === "clients") {
    const requiredFields = ["name"];
    const firstRow = data[0];

    requiredFields.forEach((field) => {
      if (!firstRow.hasOwnProperty(field)) {
        errors.push(`Le champ "${field}" est requis pour l'import de clients`);
      }
    });
  } else if (entityType === "pets") {
    const requiredFields = [
      "name",
      "breed",
      "weight",
      "height",
      "gender",
      "birthDate",
    ];
    const firstRow = data[0];

    requiredFields.forEach((field) => {
      if (!firstRow.hasOwnProperty(field)) {
        errors.push(`Le champ "${field}" est requis pour l'import d'animaux`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
