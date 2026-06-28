import { Resend } from "resend";

let resendClient: Resend | null = null;

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is required to send emails.");
  }

  resendClient ??= new Resend(apiKey);

  return resendClient;
};

export const resend = {
  get emails() {
    return getResend().emails;
  },
};
