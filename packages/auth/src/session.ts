export type BiumeSession = {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  organization?: {
    id: string;
    name: string;
  } | null;
};

export function requireSession(session: BiumeSession | null | undefined): BiumeSession {
  if (!session) {
    throw new Error("A signed-in Biume session is required.");
  }

  return session;
}
