import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

const rootDir = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig(({ mode }) => {
  for (const [key, value] of Object.entries(loadEnv(mode, rootDir, ""))) {
    process.env[key] ??= value;
  }

  return {
    envDir: rootDir,
    server: {
      port: 3002,
      strictPort: true,
    },
    resolve: {
      alias: {
        "next/cache": fileURLToPath(new URL("./src/next-compat/cache.ts", import.meta.url)),
        "next/headers": fileURLToPath(new URL("./src/next-compat/headers.ts", import.meta.url)),
        "next/image": fileURLToPath(new URL("./src/next-compat/image.tsx", import.meta.url)),
        "next/link": fileURLToPath(new URL("./src/next-compat/link.tsx", import.meta.url)),
        "next/navigation": fileURLToPath(
          new URL("./src/next-compat/navigation.ts", import.meta.url),
        ),
        "next/server": fileURLToPath(new URL("./src/next-compat/server.ts", import.meta.url)),
        "@/emails": fileURLToPath(new URL("../../emails", import.meta.url)),
        "#app": fileURLToPath(new URL("./src", import.meta.url)),
        "@": fileURLToPath(new URL("../marketing/src", import.meta.url)),
      },
      tsconfigPaths: true,
    },
    plugins: [tailwindcss(), tanstackStart(), viteReact()],
  };
});
