import {
  inferAdditionalFields,
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, member, owner } from "./auth-constants";

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac: ac,
      roles: {
        member,
        admin,
        owner,
      },
    }),
    twoFactorClient(),
    inferAdditionalFields({
      organization: {
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
      user: {
        image: {
          type: "string",
          defaultValue: "",
          required: false,
        },
        lang: {
          type: "string",
          defaultValue: "fr",
          required: false,
        },
        phoneNumber: {
          type: "string",
          defaultValue: "",
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
    }),
  ],
});

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  verifyEmail,
  getSession,
  sendVerificationEmail,
  linkSocial,
  deleteUser,
  updateUser,
  requestPasswordReset,
  resetPassword,
  useActiveMember,
  twoFactor,
  organization,
  changeEmail,
  changePassword,
  useActiveOrganization,
  useListOrganizations,
} = authClient;
