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

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const packages = packageJson.workspaces?.packages ?? [];

if (!packages.includes("apps/*") || !packages.includes("packages/*")) {
  fail('Root package.json must include workspaces.packages ["apps/*", "packages/*"].');
}

const expectedRootScripts = {
  dev: "next dev",
  "dev:apps": "turbo dev",
  build: "next build",
  "build:apps": "turbo build",
  lint: "eslint",
  "lint:apps": "turbo lint",
  start: "next start",
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
};

for (const [script, expected] of Object.entries(expectedRootScripts)) {
  if (packageJson.scripts?.[script] !== expected) {
    fail(`Root package.json script "${script}" must be "${expected}" during Phase 1.`);
  }
}

const gitignore = readFileSync(join(root, ".gitignore"), "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim());

if (gitignore.includes("bun.lock")) {
  fail("Root .gitignore must not ignore bun.lock.");
}

console.log("Biume v2 monorepo shell structure is valid.");
