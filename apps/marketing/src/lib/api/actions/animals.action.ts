"use server";

import { db } from "@/lib/utils/db";
import { getCurrentOrganization } from "./auth.action";
import { Animal } from "@/lib/schemas/animals";

export async function getAllAnimals() {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) throw new Error("Organization not found");

    const animals = await db.query.animals.findMany();
    return animals as Animal[];
  } catch (error) {
    console.error("Error getting all animals", error);
    throw new Error("Error getting all animals");
  }
}
