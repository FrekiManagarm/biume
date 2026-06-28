import { createServerOnlyFn } from "@tanstack/react-start";

type CookieStore = {
  get: (name: string) => { name: string; value: string } | undefined;
  getAll: () => Array<{ name: string; value: string }>;
};

const currentRequestHeaders = createServerOnlyFn(async () => {
  const { getRequest } = await import("@tanstack/react-start/server");

  try {
    return getRequest().headers;
  } catch {
    return new Headers();
  }
});

function parseCookieHeader(cookieHeader: string | null) {
  return new Map(
    (cookieHeader ?? "")
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const separator = cookie.indexOf("=");
        const name = separator >= 0 ? cookie.slice(0, separator) : cookie;
        const value = separator >= 0 ? cookie.slice(separator + 1) : "";

        return [name, decodeURIComponent(value)] as const;
      }),
  );
}

export async function headers() {
  return currentRequestHeaders();
}

export async function cookies(): Promise<CookieStore> {
  const requestHeaders = await currentRequestHeaders();
  const parsed = parseCookieHeader(requestHeaders.get("cookie"));

  return {
    get: (name) => {
      const value = parsed.get(name);

      return value === undefined ? undefined : { name, value };
    },
    getAll: () =>
      Array.from(parsed.entries()).map(([name, value]) => ({ name, value })),
  };
}
