import {
  redirect as routerRedirect,
  useLocation,
  useNavigate,
  useParams as useRouterParams,
} from "@tanstack/react-router";

export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (href: string) => navigate({ to: href }),
    replace: (href: string) => navigate({ to: href, replace: true }),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
    prefetch: async () => undefined,
  };
}

export function usePathname() {
  return useLocation({ select: (location) => location.pathname });
}

export function useSearchParams() {
  const href = useLocation({ select: (location) => location.href });
  const query = href.includes("?") ? href.slice(href.indexOf("?")) : "";

  return new URLSearchParams(query);
}

export function useParams(): Record<string, string | undefined> {
  const params = useRouterParams({ strict: false }) as Record<
    string,
    string | undefined
  >;

  return {
    ...params,
    reportId: params.reportId ?? params.id,
    clientId: params.clientId ?? params.id,
  };
}

export function redirect(to: string) {
  throw routerRedirect({ to });
}

export function notFound(): never {
  throw new Response("Not found", { status: 404 });
}
