import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { NuqsAdapter } from "nuqs/adapters/next";

interface LayoutCacheProviderProps {
  children: React.ReactNode;
}

export async function LayoutCacheProvider({
  children,
}: LayoutCacheProviderProps) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;
  const defaultOpen = sidebarState === "true";

  // Maintenant nous pouvons utiliser extractRouterConfig sans conflit
  const routerConfig = extractRouterConfig(ourFileRouter);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <NextSSRPlugin routerConfig={routerConfig} />
      <NuqsAdapter>{children}</NuqsAdapter>
    </SidebarProvider>
  );
}
