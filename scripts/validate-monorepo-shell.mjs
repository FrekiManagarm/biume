import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const requiredFiles = [
  "turbo.json",
  "apps/marketing/package.json",
  "apps/marketing/src/app/page.tsx",
  "apps/app/package.json",
  "apps/app/src/routes/__root.tsx",
  "packages/ui/package.json",
  "packages/ui/src/styles/globals.css",
  "packages/config/package.json",
  "packages/env/package.json",
  "packages/db/package.json",
  "packages/auth/package.json",
];

const root = process.cwd();
const missing = requiredFiles.filter((file) => !existsSync(join(root, file)));

if (missing.length > 0) {
  console.error("Missing monorepo shell files:");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const packages = packageJson.workspaces?.packages ?? [];

if (!packages.includes("apps/*") || !packages.includes("packages/*")) {
  console.error('Root package.json must include workspaces.packages ["apps/*", "packages/*"].');
  process.exit(1);
}

console.log("Biume v2 monorepo shell structure is valid.");
