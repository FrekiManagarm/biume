import Providers from "@/lib/context/providers";

export async function ProvidersCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
