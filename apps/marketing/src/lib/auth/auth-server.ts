import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization, twoFactor } from "better-auth/plugins";
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

const defaultProductAppUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://app.biume.com";

const productAppUrl =
  process.env.NEXT_PUBLIC_PRODUCT_APP_URL ?? defaultProductAppUrl;

const authBaseUrl =
  process.env.BETTER_AUTH_URL &&
  process.env.BETTER_AUTH_URL !== process.env.NEXT_PUBLIC_APP_URL
    ? process.env.BETTER_AUTH_URL
    : productAppUrl;

const trustedOrigins = Array.from(
  new Set(
    [
      authBaseUrl,
      productAppUrl,
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
      process.env.NODE_ENV === "development" ? "http://localhost:3002" : null,
    ].filter((origin): origin is string => Boolean(origin)),
  ),
);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const socialProviders =
  googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : {};

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
  baseURL: authBaseUrl,
  trustedOrigins,
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
  socialProviders,
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
      organizationHooks: {
        afterCreateOrganization: async (data) => {
          const { organization } = data;

          const org = await db.query.organization.findFirst({
            where: eq(organizationSchema.id, organization.id),
          });

          if (!org) {
            throw new Error("Organization not found");
          }

          try {
            const customer = await autumnLib.customers.getOrCreate({
              customerId: organization.id,
              name: organization.name,
              email: org.email,
            });

            await db
              .update(organizationSchema)
              .set({
                customerStripeId: customer.id || "",
              })
              .where(eq(organizationSchema.id, organization.id));
          } catch (error) {
            console.error(error);
          }
        },
        afterDeleteOrganization: async (data) => {
          const { organization } = data;

          try {
            const org = await db.query.organization.findFirst({
              where: eq(organizationSchema.id, organization.id),
            });

            if (!org) {
              throw new Error("Organization not found");
            }

            if (org.customerStripeId) {
              await autumnLib.customers.delete({
                customerId: org.customerStripeId,
                deleteInStripe: true,
              });
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
