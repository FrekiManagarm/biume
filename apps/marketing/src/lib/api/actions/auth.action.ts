"use server";

import { auth } from "@/lib/auth/auth-server";
import { db } from "@/lib/utils/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  Organization,
  organization as organizationSchema,
} from "@/lib/schemas";

export const getUser = async () => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getCurrentOrganization = async () => {
  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  const fullOrganization = await db.query.organization.findFirst({
    where: eq(organizationSchema.id, organization.id),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
    columns: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      customerStripeId: true,
      onBoardingComplete: true,
      email: true,
      lang: true,
      locked: true,
      verified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!fullOrganization) {
    throw new Error("Organization not found");
  }

  return fullOrganization as Organization;
};
