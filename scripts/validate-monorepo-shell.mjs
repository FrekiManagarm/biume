import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const requiredFiles = [
  "turbo.json",
  "apps/marketing/package.json",
  "apps/marketing/src/app/(main)/page.tsx",
  "apps/marketing/src/components/landing/index.tsx",
  "apps/marketing/src/hooks/useAppContext.ts",
  "apps/marketing/src/lib/api/actions/auth.action.ts",
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

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

for (const legacyDir of ["app", "components", "lib", "hooks"]) {
  if (existsSync(join(root, legacyDir))) {
    fail(`Root ${legacyDir}/ must not exist; application code must live inside apps/* workspaces.`);
  }
}

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
  fail('Root package.json must include workspaces.packages ["apps/*", "packages/*"].');
}

const expectedRootScripts = {
  dev: "turbo dev",
  "dev:apps": "turbo dev",
  build: "turbo build",
  "build:apps": "turbo build",
  lint: "turbo lint",
  "lint:apps": "turbo lint",
  start: "bun -F marketing start",
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
};

for (const [script, expected] of Object.entries(expectedRootScripts)) {
  if (packageJson.scripts?.[script] !== expected) {
    fail(`Root package.json script "${script}" must be "${expected}" after app migration.`);
  }
}

const legacyScripts = Object.keys(packageJson.scripts ?? {}).filter((script) =>
  script.startsWith("legacy:"),
);

if (legacyScripts.length > 0) {
  fail(`Root package.json must not keep legacy Next scripts: ${legacyScripts.join(", ")}.`);
}

const gitignore = readFileSync(join(root, ".gitignore"), "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim());

if (gitignore.includes("bun.lock")) {
  fail("Root .gitignore must not ignore bun.lock.");
}

console.log("Biume v2 monorepo shell structure is valid.");
