import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization, twoFactor } from "better-auth/plugins";
import { autumn } from "autumn-js/better-auth";
import { eq } from "drizzle-orm";
import { randomBytes, timingSafeEqual } from "crypto";
import * as crypto from "crypto";

import OrganizationInvitation from "@/emails/OrganizationInvitation";

import {
  account,
  invitation,
  member as memberSchema,
  organization as organizationSchema,
  session,
  twoFactor as twoFactorSchema,
  verification,
} from "../schemas";
import { user as dbUser } from "../schemas";
import { db } from "../utils/db";
import { resend } from "../utils/resend";
import { ResetPassword } from "@/emails/ResetPassword";
import { ac, member, admin, owner } from "./auth-constants";
import { render } from "@react-email/render";
import { autumn as autumnLib } from "../utils/autumn";

// Fonction wrapper manuelle pour scrypt
const scryptAsync = (
  password: string,
  salt: Buffer,
  keylen: number,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
};

// Define base types
export type BaseUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BaseMember = {
  id: string;
  role: string;
  userId: string;
  organizationId: string;
};

export type BaseInvitation = {
  id: string;
  email: string;
  role: string;
  organizationId: string;
};

export type BaseOrganization = {
  id: string;
  name: string;
  members: BaseMember[];
  invitations: BaseInvitation[];
};

export const auth = betterAuth({
  appName: "Biume",
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      organizations: organizationSchema,
      users: dbUser,
      accounts: account,
      verifications: verification,
      twoFactors: twoFactorSchema,
      sessions: session,
      invitations: invitation,
      members: memberSchema,
    },
    usePlural: true,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => {
        const salt = randomBytes(16);
        const hash = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${salt.toString("hex")}:${hash.toString("hex")}`;
      },
      verify: async ({
        password,
        hash,
      }: {
        password: string;
        hash: string;
      }) => {
        const [saltHex, hashHex] = hash.split(":");
        if (!saltHex || !hashHex) {
          return false;
        }

        const salt = Buffer.from(saltHex, "hex");
        const originalHash = Buffer.from(hashHex, "hex");
        const derivedHash = (await scryptAsync(password, salt, 64)) as Buffer;

        return timingSafeEqual(originalHash, derivedHash);
      },
    },
    sendResetPassword: async ({ user, url }) => {
      const webContent = await render(
        ResetPassword({
          resetLink: url,
          username: user.name || "Utilisateur",
        }),
      );

      await resend.emails.send({
        from: "Biume <noreply@biume.com>",
        to: user.email,
        subject: "Réinitialisez votre mot de passe Biume",
        html: webContent,
      });
    },
  },
  user: {
    additionalFields: {
      image: {
        type: "string",
        defaultValue: "",
        required: false,
      },
      phoneNumber: {
        type: "string",
        defaultValue: "",
        required: false,
      },
      lang: {
        type: "string",
        defaultValue: "fr",
        required: false,
      },
      smsNotifications: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      emailNotifications: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
    },
  },
  plugins: [
    autumn({
      customerScope: "organization",
      identify: async (req) => {
        if (!req.organization) {
          throw new Error("Organization not found");
        }

        return {
          customerId: req.organization.id,
        };
      },
    }),
    nextCookies(),
    twoFactor(),
    organization({
      schema: {
        organization: {
          additionalFields: {
            onBoardingComplete: {
              type: "boolean",
              defaultValue: false,
              required: false,
            },
            description: {
              type: "string",
              defaultValue: "",
              required: false,
            },
            ai: {
              type: "boolean",
              defaultValue: false,
              required: false,
            },
            email: {
              type: "string",
              defaultValue: "",
              required: false,
            },
            locked: {
              type: "boolean",
              defaultValue: false,
              required: false,
            },
            lang: {
              type: "string",
              defaultValue: "fr",
              required: false,
            },
            onBoardingExplications: {
              type: "boolean",
              defaultValue: false,
              required: false,
            },
          },
        },
      },
      organizationCreation: {
        afterCreate: async (data) => {
          const { organization } = data;

          const org = await db.query.organization.findFirst({
            where: eq(organizationSchema.id, organization.id),
          });

          if (!org) {
            throw new Error("Organization not found");
          }

          try {
            const customer = await autumnLib.customers.create({
              id: organization.id,
              name: organization.name,
              email: org.email,
            });

            await db
              .update(organizationSchema)
              .set({
                customerStripeId: customer.data?.id || "",
              })
              .where(eq(organizationSchema.id, organization.id));
          } catch (error) {
            console.error(error);
          }
        },
      },
      organizationDeletion: {
        beforeDelete: async (data) => {
          const { organization } = data;

          try {
            const org = await db.query.organization.findFirst({
              where: eq(organizationSchema.id, organization.id),
            });

            if (!org) {
              throw new Error("Organization not found");
            }

            if (org.customerStripeId) {
              await autumnLib.customers.delete(org.customerStripeId);
            }
          } catch (error) {
            console.error(error);
          }
        },
      },
      ac: ac,
      roles: {
        member,
        admin,
        owner,
      },
      sendInvitationEmail: async (data) => {
        const { email, inviter, organization } = data;

        const webContent = await render(
          OrganizationInvitation({
            inviterName: inviter.user.name,
            organizationName: organization.name,
            inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${data.id}`,
          }),
        );

        await resend.emails.send({
          from: "Biume <onboarding@biume.com>",
          to: email,
          subject: "Invitation à rejoindre l'organisation",
          html: webContent,
        });
      },
      membershipLimit: 10,
    }),
  ],
});

// Export inferred types
export type User = BaseUser & typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;
export type Organization = BaseOrganization;
