# Biume v2 Monorepo Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the Biume v2 Turborepo shell with dedicated Next.js marketing and TanStack Start product apps while preserving the current root Next.js app as legacy migration source.

**Architecture:** Phase 1 is a cohabitation phase. The root becomes a Bun/Turborepo workspace orchestrator, new apps boot independently, and shared packages establish boundaries without deleting the current app code. Later phases migrate marketing, auth, reports, patients, clients, agenda, AI, billing, emails, and jobs into those apps/packages.

**Tech Stack:** Bun workspaces, Turborepo, Next.js 16 App Router, TanStack Start, Vite, React 19, Tailwind CSS v4, shadcn/ui, Drizzle, Better Auth, Zod, Vercel.

## Global Constraints

- Biume v2 is a total reset, not a polish pass.
- Architecture follows the Dunlo monorepo model.
- Biume keeps primary violet `hsl(251 73% 72%)` and secondary green `hsl(148 71% 45%)`.
- Marketing promise is the anatomical report wedge.
- Product app framework is TanStack Start.
- Migration is staged to avoid losing existing functionality.
- Do not delete the current root app until new apps reach parity.
- Do not overwrite non-committed user changes.
- Keep user-facing product copy in French.
- Use lucide-react for icons.
- Use Tailwind CSS v4 patterns: `@import "tailwindcss"` and `@tailwindcss/postcss`.
- Update Vercel CLI before deployment work with `npm i -g vercel@latest` or `pnpm add -g vercel@latest`.

---

## Scope Boundary

This plan implements Phase 1 only: the monorepo shell.

It intentionally does not migrate the real landing page, blog content, auth flows, dashboard routes, reports module, database schemas, AI agents, emails, UploadThing, Autumn, or Trigger jobs. Those get separate plans after this shell is green.

## File Structure

Create or modify these files:

- Modify `package.json`: convert root scripts to Turbo orchestration while preserving legacy scripts.
- Create `turbo.json`: root task graph.
- Create `scripts/validate-monorepo-shell.mjs`: structural validation for Phase 1.
- Create `packages/config/package.json`: shared config package.
- Create `packages/config/tsconfig/base.json`: shared TS baseline.
- Create `packages/config/tsconfig/react.json`: React TS baseline.
- Create `packages/config/tsconfig/next.json`: Next app TS baseline.
- Create `packages/config/tsconfig/vite.json`: Vite/TanStack Start TS baseline.
- Create `packages/ui/package.json`: shared UI package.
- Create `packages/ui/tsconfig.json`: UI typecheck config.
- Create `packages/ui/postcss.config.mjs`: shared Tailwind v4 PostCSS config.
- Create `packages/ui/src/styles/globals.css`: Biume v2 shared tokens.
- Create `packages/ui/src/lib/utils.ts`: shared `cn`.
- Create `packages/ui/src/components/button.tsx`: minimal button primitive for bootstrapping.
- Create `packages/ui/src/components/badge.tsx`: minimal badge primitive for bootstrapping.
- Create `packages/env/package.json`: typed env package.
- Create `packages/env/tsconfig.json`: env package typecheck config.
- Create `packages/env/src/server.ts`: server env schema.
- Create `packages/env/src/web.ts`: public env schema.
- Create `packages/db/package.json`: DB package boundary.
- Create `packages/db/tsconfig.json`: DB package typecheck config.
- Create `packages/db/drizzle.config.ts`: DB package Drizzle config pointing at package-owned schema path.
- Create `packages/db/src/client.ts`: DB client boundary.
- Create `packages/db/src/schema/index.ts`: initial schema barrel.
- Create `packages/auth/package.json`: auth package boundary.
- Create `packages/auth/tsconfig.json`: auth package typecheck config.
- Create `packages/auth/src/session.ts`: initial session contract.
- Create `apps/marketing/package.json`: Next marketing app package.
- Create `apps/marketing/tsconfig.json`: Next marketing TS config.
- Create `apps/marketing/next.config.ts`: Next config with monorepo tracing root.
- Create `apps/marketing/postcss.config.mjs`: import shared PostCSS config.
- Create `apps/marketing/src/app/layout.tsx`: marketing root layout.
- Create `apps/marketing/src/app/page.tsx`: minimal wedge landing screen.
- Create `apps/app/package.json`: TanStack Start app package.
- Create `apps/app/tsconfig.json`: TanStack Start TS config.
- Create `apps/app/vite.config.ts`: TanStack Start Vite config.
- Create `apps/app/src/index.css`: app global CSS import.
- Create `apps/app/src/router.tsx`: router factory.
- Create `apps/app/src/routes/__root.tsx`: root route.
- Create `apps/app/src/routes/index.tsx`: temporary entry route.

Do not move current root files in this phase.

---

### Task 1: Root Workspace and Structural Validation

**Files:**
- Modify: `package.json`
- Create: `turbo.json`
- Create: `scripts/validate-monorepo-shell.mjs`

**Interfaces:**
- Produces: root scripts `dev`, `build`, `lint`, `check-types`, `dev:marketing`, `dev:app`, `legacy:dev`, `legacy:build`, `legacy:lint`, `validate:monorepo`.
- Produces: Turbo tasks `build`, `dev`, `lint`, `check-types`, `validate`.
- Consumes: existing root package dependencies and existing root Next app.

- [ ] **Step 1: Write the structural validation script**

Create `scripts/validate-monorepo-shell.mjs`:

```js
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
```

- [ ] **Step 2: Run validation to verify it fails before shell files exist**

Run:

```bash
bun scripts/validate-monorepo-shell.mjs
```

Expected: FAIL with missing `turbo.json`, `apps/marketing/package.json`, `apps/app/package.json`, and `packages/*/package.json`.

- [ ] **Step 3: Modify root `package.json` scripts and workspaces**

Keep the current dependency lists intact during Phase 1. Add `workspaces`, add `turbo` to `devDependencies`, and replace the `scripts` object with:

```json
{
  "dev": "turbo dev",
  "build": "next build",
  "build:apps": "turbo build",
  "lint": "turbo lint",
  "check-types": "turbo check-types",
  "validate": "turbo validate",
  "validate:monorepo": "bun scripts/validate-monorepo-shell.mjs",
  "dev:marketing": "turbo -F marketing dev",
  "dev:app": "turbo -F app dev",
  "legacy:dev": "next dev",
  "legacy:build": "next build",
  "legacy:start": "next start",
  "legacy:lint": "eslint",
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "email:dev": "email dev --port=3001",
  "email:prod": "email build --packageManager=bun",
  "email:start": "email start",
  "start": "next start"
}
```

Keep root `db:*` scripts on the legacy Drizzle config in Phase 1. The package-level `@biume/db` scripts are available for v2 once the real schemas move out of `lib/schemas`.

Add this top-level field:

```json
{
  "workspaces": {
    "packages": ["apps/*", "packages/*"],
    "catalog": {
      "typescript": "^6.0.3",
      "@types/node": "^26.0.1",
      "@types/react": "^19.2.17",
      "@types/react-dom": "^19.2.3",
      "react": "19.2.7",
      "react-dom": "19.2.7",
      "zod": "^4.4.3"
    }
  }
}
```

Add this dev dependency:

```json
{
  "turbo": "^2.8.12"
}
```

- [ ] **Step 4: Create `turbo.json`**

Create `turbo.json`:

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", ".vercel/output/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "validate": {
      "dependsOn": ["^validate"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "db:push": {
      "cache": false
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Step 5: Run validation and expect package/app files to remain missing**

Run:

```bash
bun run validate:monorepo
```

Expected: FAIL with missing app and package files, but no workspace configuration error.

- [ ] **Step 6: Commit root workspace baseline**

```bash
git add package.json turbo.json scripts/validate-monorepo-shell.mjs
git commit -m "chore: add biume v2 turbo workspace shell"
```

---

### Task 2: Shared Config Package

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig/base.json`
- Create: `packages/config/tsconfig/react.json`
- Create: `packages/config/tsconfig/next.json`
- Create: `packages/config/tsconfig/vite.json`

**Interfaces:**
- Produces: shared TS configs referenced by apps and packages.
- Consumes: root workspace dependency catalog.

- [ ] **Step 1: Create config package manifest**

Create `packages/config/package.json`:

```json
{
  "name": "@biume/config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./tsconfig/base": "./tsconfig/base.json",
    "./tsconfig/react": "./tsconfig/react.json",
    "./tsconfig/next": "./tsconfig/next.json",
    "./tsconfig/vite": "./tsconfig/vite.json"
  }
}
```

- [ ] **Step 2: Create base TypeScript config**

Create `packages/config/tsconfig/base.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

- [ ] **Step 3: Create React TypeScript config**

Create `packages/config/tsconfig/react.json`:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

- [ ] **Step 4: Create Next TypeScript config**

Create `packages/config/tsconfig/next.json`:

```json
{
  "extends": "./react.json",
  "compilerOptions": {
    "allowJs": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create Vite TypeScript config**

Create `packages/config/tsconfig/vite.json`:

```json
{
  "extends": "./react.json",
  "compilerOptions": {
    "types": ["vite/client"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 6: Run package manifest check**

Run:

```bash
bun pm pkg get name --cwd packages/config
```

Expected: prints `"@biume/config"`.

- [ ] **Step 7: Commit config package**

```bash
git add packages/config
git commit -m "chore: add shared config package"
```

---

### Task 3: Shared UI Package

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/postcss.config.mjs`
- Create: `packages/ui/src/styles/globals.css`
- Create: `packages/ui/src/lib/utils.ts`
- Create: `packages/ui/src/components/button.tsx`
- Create: `packages/ui/src/components/badge.tsx`

**Interfaces:**
- Consumes: `@biume/config/tsconfig/react`.
- Produces: `@biume/ui/globals.css`, `@biume/ui/lib/utils`, `@biume/ui/components/button`, `@biume/ui/components/badge`.

- [ ] **Step 1: Create UI package manifest**

Create `packages/ui/package.json`:

```json
{
  "name": "@biume/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./lib/*": "./src/lib/*.ts",
    "./components/*": "./src/components/*.tsx",
    "./postcss.config": "./postcss.config.mjs"
  },
  "scripts": {
    "check-types": "tsc --noEmit",
    "lint": "eslint .",
    "validate": "bun -e \"import('./src/lib/utils.ts').then(() => console.log('@biume/ui ok'))\""
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.3.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.21.0",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@biume/config": "workspace:*",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:",
    "tailwindcss": "^4.3.1",
    "typescript": "catalog:"
  }
}
```

- [ ] **Step 2: Create UI TypeScript config**

Create `packages/ui/tsconfig.json`:

```json
{
  "extends": "@biume/config/tsconfig/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create shared PostCSS config**

Create `packages/ui/postcss.config.mjs`:

```js
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

- [ ] **Step 4: Create shared Biume v2 globals**

Create `packages/ui/src/styles/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@source "../../../apps/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";

:root {
  --radius: 0.75rem;
  --biume-violet: hsl(251 73% 72%);
  --biume-green: hsl(148 71% 45%);
  --biume-ink: hsl(0 0% 7%);
  --biume-paper: hsl(0 0% 97%);
  --background: hsl(0 0% 97%);
  --foreground: hsl(0 0% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(0 0% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(0 0% 3.9%);
  --primary: hsl(251 73% 72%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(148 71% 45%);
  --secondary-foreground: hsl(0 0% 100%);
  --muted: hsl(0 0% 96.1%);
  --muted-foreground: hsl(0 0% 45.1%);
  --accent: hsl(292 25% 95%);
  --accent-foreground: hsl(0 0% 9%);
  --destructive: hsl(0 84.2% 60.2%);
  --border: hsl(0 0% 89.8%);
  --input: hsl(0 0% 89.8%);
  --ring: hsl(251 73% 72%);
}

.dark {
  --background: hsl(240 5.9% 5%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(0 0% 13%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(0 0% 12.5%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: hsl(251 73% 72%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(148 71% 45%);
  --secondary-foreground: hsl(0 0% 100%);
  --muted: hsl(0 0% 14.9%);
  --muted-foreground: hsl(0 0% 63.9%);
  --accent: hsl(0 0% 19%);
  --accent-foreground: hsl(0 0% 98%);
  --destructive: hsl(0 84.2% 60.2%);
  --border: hsl(0 0% 22%);
  --input: hsl(0 0% 18%);
  --ring: hsl(251 73% 72%);
}

@theme inline {
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-biume-violet: var(--biume-violet);
  --color-biume-green: var(--biume-green);
  --color-biume-ink: var(--biume-ink);
  --color-biume-paper: var(--biume-paper);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}
```

- [ ] **Step 5: Create shared `cn` utility**

Create `packages/ui/src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 6: Create button primitive**

Create `packages/ui/src/components/button.tsx`:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/85",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border border-border bg-background hover:bg-muted",
        ghost: "hover:bg-muted",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-10 px-5",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

- [ ] **Step 7: Create badge primitive**

Create `packages/ui/src/components/badge.tsx`:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/12 text-foreground",
        success: "border-transparent bg-secondary/12 text-foreground",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

- [ ] **Step 8: Run UI validation and typecheck**

Run:

```bash
bun install --save-text-lockfile
bun -F @biume/ui validate
bun -F @biume/ui check-types
```

Expected: both UI commands PASS.

- [ ] **Step 9: Commit UI package**

```bash
git add bun.lock package.json packages/ui
git commit -m "feat: add biume shared ui package"
```

---

### Task 4: Env, DB, and Auth Boundary Packages

**Files:**
- Create: `packages/env/package.json`
- Create: `packages/env/tsconfig.json`
- Create: `packages/env/src/server.ts`
- Create: `packages/env/src/web.ts`
- Create: `packages/db/package.json`
- Create: `packages/db/tsconfig.json`
- Create: `packages/db/drizzle.config.ts`
- Create: `packages/db/src/client.ts`
- Create: `packages/db/src/schema/index.ts`
- Create: `packages/auth/package.json`
- Create: `packages/auth/tsconfig.json`
- Create: `packages/auth/src/session.ts`

**Interfaces:**
- Produces: `@biume/env/server`, `@biume/env/web`, `@biume/db/client`, `@biume/db/schema`, `@biume/auth/session`.
- Consumes: `@biume/config`, `zod`, `drizzle-orm`, `@neondatabase/serverless`.

- [ ] **Step 1: Create env package manifest**

Create `packages/env/package.json`:

```json
{
  "name": "@biume/env",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./server": "./src/server.ts",
    "./web": "./src/web.ts"
  },
  "scripts": {
    "check-types": "tsc --noEmit",
    "lint": "eslint .",
    "validate": "bun -e \"import('./src/web.ts').then(() => console.log('@biume/env ok'))\""
  },
  "dependencies": {
    "zod": "catalog:"
  },
  "devDependencies": {
    "@biume/config": "workspace:*",
    "typescript": "catalog:"
  }
}
```

- [ ] **Step 2: Create env TypeScript config**

Create `packages/env/tsconfig.json`:

```json
{
  "extends": "@biume/config/tsconfig/base",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create public env schema**

Create `packages/env/src/web.ts`:

```ts
import { z } from "zod";

const webEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

type PublicEnvSource = Partial<Record<keyof WebEnv, string | undefined>>;

const nodePublicEnv =
  typeof process === "undefined" ? undefined : (process.env as PublicEnvSource);

export function parseWebEnv(source: PublicEnvSource = nodePublicEnv ?? {}): WebEnv {
  return webEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: source.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_POSTHOG_KEY: source.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: source.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export const webEnv = parseWebEnv();
```

- [ ] **Step 4: Create server env schema**

Create `packages/env/src/server.ts`:

```ts
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().optional(),
  UPLOADTHING_TOKEN: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  AUTUMN_SECRET_KEY: z.string().optional(),
  TRIGGER_DEV_PROJECT_ID: z.string().optional(),
  TRIGGER_DEV_API_KEY: z.string().optional(),
  BIUME_AI_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export const serverEnv = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  AUTUMN_SECRET_KEY: process.env.AUTUMN_SECRET_KEY,
  TRIGGER_DEV_PROJECT_ID: process.env.TRIGGER_DEV_PROJECT_ID,
  TRIGGER_DEV_API_KEY: process.env.TRIGGER_DEV_API_KEY,
  BIUME_AI_URL: process.env.BIUME_AI_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
```

- [ ] **Step 5: Create DB package manifest**

Create `packages/db/package.json`:

```json
{
  "name": "@biume/db",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./client": "./src/client.ts",
    "./schema": "./src/schema/index.ts"
  },
  "scripts": {
    "check-types": "tsc --noEmit",
    "lint": "eslint .",
    "validate": "bun -e \"import('./src/schema/index.ts').then(() => console.log('@biume/db ok'))\"",
    "db:push": "drizzle-kit push --config drizzle.config.ts",
    "db:generate": "drizzle-kit generate --config drizzle.config.ts",
    "db:migrate": "drizzle-kit migrate --config drizzle.config.ts",
    "db:studio": "drizzle-kit studio --config drizzle.config.ts"
  },
  "dependencies": {
    "@biume/env": "workspace:*",
    "@neondatabase/serverless": "^1.1.0",
    "drizzle-orm": "^0.45.2"
  },
  "devDependencies": {
    "@biume/config": "workspace:*",
    "drizzle-kit": "^0.31.10",
    "typescript": "catalog:"
  }
}
```

- [ ] **Step 6: Create DB TypeScript config**

Create `packages/db/tsconfig.json`:

```json
{
  "extends": "@biume/config/tsconfig/base",
  "include": ["src/**/*.ts", "drizzle.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 7: Create package Drizzle config**

Create `packages/db/drizzle.config.ts`:

```ts
import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
```

- [ ] **Step 8: Create DB client boundary**

Create `packages/db/src/client.ts`:

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { serverEnv } from "@biume/env/server";

const databaseUrl = serverEnv.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to create the Biume database client.");
}

const sql = neon(databaseUrl);

export const db = drizzle(sql);
```

- [ ] **Step 9: Create schema barrel**

Create `packages/db/src/schema/index.ts`:

```ts
export const schemaPackageReady = true;
```

- [ ] **Step 10: Create auth package manifest**

Create `packages/auth/package.json`:

```json
{
  "name": "@biume/auth",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./session": "./src/session.ts"
  },
  "scripts": {
    "check-types": "tsc --noEmit",
    "lint": "eslint .",
    "validate": "bun -e \"import('./src/session.ts').then(() => console.log('@biume/auth ok'))\""
  },
  "dependencies": {
    "@biume/env": "workspace:*",
    "zod": "catalog:"
  },
  "devDependencies": {
    "@biume/config": "workspace:*",
    "typescript": "catalog:"
  }
}
```

- [ ] **Step 11: Create auth TypeScript config**

Create `packages/auth/tsconfig.json`:

```json
{
  "extends": "@biume/config/tsconfig/base",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 12: Create session contract**

Create `packages/auth/src/session.ts`:

```ts
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
```

- [ ] **Step 13: Run package validations**

Run:

```bash
bun install --save-text-lockfile
bun -F @biume/env validate
bun -F @biume/env check-types
bun -F @biume/db validate
bun -F @biume/db check-types
bun -F @biume/auth validate
bun -F @biume/auth check-types
```

Expected: all validation and typecheck commands PASS. `@biume/db/client` is not imported in validation because it requires a live `DATABASE_URL`.

- [ ] **Step 14: Commit boundary packages**

```bash
git add bun.lock package.json packages/env packages/db packages/auth
git commit -m "chore: add env db auth package boundaries"
```

---

### Task 5: Next.js Marketing App Shell

**Files:**
- Create: `apps/marketing/package.json`
- Create: `apps/marketing/tsconfig.json`
- Create: `apps/marketing/next.config.ts`
- Create: `apps/marketing/postcss.config.mjs`
- Create: `apps/marketing/src/app/layout.tsx`
- Create: `apps/marketing/src/app/page.tsx`

**Interfaces:**
- Consumes: `@biume/ui/globals.css`, `@biume/ui/components/button`, `@biume/ui/components/badge`.
- Produces: `marketing` workspace with `dev`, `build`, `check-types`, `lint`, `validate`.

- [ ] **Step 1: Create marketing package manifest**

Create `apps/marketing/package.json`:

```json
{
  "name": "marketing",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start --port 3000",
    "check-types": "tsc --noEmit",
    "lint": "eslint .",
    "validate": "bun -e \"console.log('marketing app ok')\""
  },
  "dependencies": {
    "@biume/ui": "workspace:*",
    "lucide-react": "^1.21.0",
    "next": "16.2.9",
    "react": "catalog:",
    "react-dom": "catalog:"
  },
  "devDependencies": {
    "@biume/config": "workspace:*",
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "@tailwindcss/postcss": "^4.3.1",
    "typescript": "catalog:"
  }
}
```

- [ ] **Step 2: Create marketing TypeScript config**

Create `apps/marketing/tsconfig.json`:

```json
{
  "extends": "@biume/config/tsconfig/next",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 3: Create marketing Next config**

Create `apps/marketing/next.config.ts`:

```ts
import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
```

- [ ] **Step 4: Create marketing PostCSS config**

Create `apps/marketing/postcss.config.mjs`:

```js
export { default } from "@biume/ui/postcss.config";
```

- [ ] **Step 5: Create marketing root layout**

Create `apps/marketing/src/app/layout.tsx`:

```tsx
import "@biume/ui/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Biume - Comptes rendus anatomiques pour praticiens animaliers",
  description:
    "Transformez chaque consultation animale en compte rendu anatomique clair, professionnel et pret a envoyer.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Create marketing homepage shell**

Create `apps/marketing/src/app/page.tsx`:

```tsx
import { ArrowRight, FileText, PawPrint } from "lucide-react";
import { Badge } from "@biume/ui/components/badge";
import { Button } from "@biume/ui/components/button";

export default function Page() {
  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <section className="relative mx-auto grid min-h-dvh w-full max-w-7xl items-center gap-12 px-4 py-28 md:grid-cols-[0.95fr_1.05fr] md:px-6">
        <div className="max-w-2xl">
          <Badge className="mb-6 gap-2" variant="default">
            <PawPrint className="size-3.5" />
            Biume v2
          </Badge>
          <h1 className="text-4xl font-semibold leading-none tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Le compte rendu anatomique que vous etes fier d'envoyer.
          </h1>
          <p className="mt-6 max-w-[58ch] text-base leading-7 text-muted-foreground md:text-lg">
            Transformez vos consultations animales en rapports visuels, clairs et professionnels pour aider les proprietaires a comprendre votre travail.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              Transformer un ancien compte rendu
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline">
              Voir le produit
            </Button>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-border bg-card p-4 shadow-[0_40px_100px_-55px_rgba(15,23,42,0.58)]">
          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Rapport anatomique
                </p>
                <h2 className="mt-1 text-xl font-semibold">Nala - suivi cervical</h2>
              </div>
              <FileText className="size-5 text-primary" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="aspect-[4/5] rounded-2xl border border-primary/20 bg-primary/10" />
              <div className="space-y-3">
                <div className="h-3 w-4/5 rounded-full bg-muted" />
                <div className="h-3 w-full rounded-full bg-muted" />
                <div className="h-3 w-3/5 rounded-full bg-muted" />
                <div className="mt-5 rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-sm leading-6">
                  Version proprietaire claire, rassurante et prete a envoyer.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 7: Run marketing checks**

Run:

```bash
bun install --save-text-lockfile
bun -F marketing validate
bun -F marketing check-types
bun -F marketing build
```

Expected: all commands PASS.

- [ ] **Step 8: Commit marketing shell**

```bash
git add bun.lock package.json apps/marketing
git commit -m "feat: add next marketing app shell"
```

---

### Task 6: TanStack Start Product App Shell

**Files:**
- Create: `apps/app/package.json`
- Create: `apps/app/tsconfig.json`
- Create: `apps/app/vite.config.ts`
- Create: `apps/app/src/index.css`
- Create: `apps/app/src/router.tsx`
- Create: `apps/app/src/routes/__root.tsx`
- Create: `apps/app/src/routes/index.tsx`

**Interfaces:**
- Consumes: `@biume/ui/globals.css`, `@biume/ui/components/button`, `@tanstack/react-start`, `@tanstack/react-router`.
- Produces: `app` workspace with `dev`, `build`, `serve`, `check-types`, `lint`, `validate`.

- [ ] **Step 1: Create product app package manifest**

Create `apps/app/package.json`:

```json
{
  "name": "app",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev --port 3002",
    "build": "vite build",
    "serve": "vite preview --port 3002",
    "check-types": "tsc --noEmit",
    "lint": "eslint .",
    "validate": "bun -e \"console.log('product app ok')\""
  },
  "dependencies": {
    "@biume/auth": "workspace:*",
    "@biume/db": "workspace:*",
    "@biume/env": "workspace:*",
    "@biume/ui": "workspace:*",
    "@tailwindcss/vite": "^4.3.1",
    "@tanstack/react-query": "^5.101.1",
    "@tanstack/react-router": "^1.168.22",
    "@tanstack/react-start": "^1.167.41",
    "lucide-react": "^1.21.0",
    "react": "catalog:",
    "react-dom": "catalog:",
    "vite": "^8.0.8"
  },
  "devDependencies": {
    "@biume/config": "workspace:*",
    "@tanstack/react-router-devtools": "^1.166.13",
    "@tanstack/router-plugin": "^1.168.22",
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "@vitejs/plugin-react": "^6.0.1",
    "typescript": "catalog:"
  }
}
```

- [ ] **Step 2: Create product app TypeScript config**

Create `apps/app/tsconfig.json`:

```json
{
  "extends": "@biume/config/tsconfig/vite",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 3: Create TanStack Start Vite config**

Create `apps/app/vite.config.ts`:

```ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3002,
    strictPort: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
});
```

- [ ] **Step 4: Create product app CSS entry**

Create `apps/app/src/index.css`:

```css
@import "@biume/ui/globals.css";
```

- [ ] **Step 5: Create router factory**

Create `apps/app/src/router.tsx`:

```tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  return createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
```

- [ ] **Step 6: Create root route**

Create `apps/app/src/routes/__root.tsx`:

```tsx
import type { ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import appCss from "../index.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Biume App" },
      {
        name: "description",
        content: "Espace praticien Biume pour comptes rendus anatomiques.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create temporary app entry route**

Create `apps/app/src/routes/index.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@biume/ui/components/button";

export const Route = createFileRoute("/")({
  component: AppHome,
});

function AppHome() {
  return (
    <main className="min-h-dvh bg-background px-4 py-10 text-foreground md:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Biume product app
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-none tracking-tight md:text-6xl">
              Le rapport devient le centre du cabinet.
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-7 text-muted-foreground">
              Cette app TanStack Start accueillera les rapports, patients, clients, agenda et réglages autour du compte rendu anatomique.
            </p>
            <Button className="mt-8" size="lg">
              Préparer le premier rapport
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-5">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="font-semibold">Rapport en cours</p>
                <p className="text-sm text-muted-foreground">Structure app prete pour la migration.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-3 w-full rounded-full bg-muted" />
              <div className="h-3 w-4/5 rounded-full bg-muted" />
              <div className="h-3 w-2/3 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 8: Run product app checks**

Run:

```bash
bun install --save-text-lockfile
bun -F app validate
bun -F app check-types
bun -F app build
```

Expected: all commands PASS. `apps/app/src/routeTree.gen.ts` is generated by the TanStack Router plugin during dev/build.

- [ ] **Step 9: Commit product app shell**

```bash
git add bun.lock package.json apps/app
git commit -m "feat: add tanstack start product app shell"
```

---

### Task 7: Final Monorepo Verification

**Files:**
- Modify: files only if previous checks expose command or type issues.

**Interfaces:**
- Consumes: all Phase 1 apps and packages.
- Produces: a validated monorepo shell ready for the marketing rebuild plan.

- [ ] **Step 1: Run structural validation**

Run:

```bash
bun run validate:monorepo
```

Expected:

```txt
Biume v2 monorepo shell structure is valid.
```

- [ ] **Step 2: Run full Turbo validation**

Run:

```bash
bun run validate
```

Expected: Turbo runs package/app `validate` tasks successfully.

- [ ] **Step 3: Run full typecheck**

Run:

```bash
bun run check-types
```

Expected: TypeScript passes for the new apps/packages. If legacy root TypeScript is pulled into the command by mistake, adjust package-level `check-types` scripts so only workspace packages run.

- [ ] **Step 4: Run full build**

Run:

```bash
bun run build:apps
```

Expected: `marketing` and `app` build through Turbo. The legacy root Next app is not part of the Turbo workspace build in Phase 1.

- [ ] **Step 5: Run both dev servers manually**

Terminal 1:

```bash
bun run dev:marketing
```

Expected: Next serves the marketing app at `http://localhost:3000`.

Terminal 2:

```bash
bun run dev:app
```

Expected: Vite/TanStack Start serves the product app at `http://localhost:3002`.

- [ ] **Step 6: Smoke test pages in browser**

Open:

```txt
http://localhost:3000
http://localhost:3002
```

Expected:

- marketing page shows the Biume report-first hero;
- product app page shows the TanStack Start shell;
- both pages use Biume violet/green shared tokens;
- no visible horizontal overflow at mobile width.

- [ ] **Step 7: Run legacy app checks**

Run:

```bash
bun run legacy:lint
bun run legacy:build
```

Expected:

- these may fail with the already-known ESLint circular config and Stepper type issue;
- record exact failures in the final handoff;
- do not modify unrelated legacy files in this Phase 1 plan.

- [ ] **Step 8: Commit final verification notes**

If command adjustments were needed, commit them:

```bash
git add package.json turbo.json apps packages scripts
git commit -m "chore: verify biume v2 monorepo shell"
```

If no file changes were needed after previous commits, skip this commit and record the verification results in the final response.

---

## Self-Review

Spec coverage:

- Monorepo root: covered by Task 1.
- Shared config: covered by Task 2.
- Shared UI tokens and primitives: covered by Task 3.
- Env, DB, auth package boundaries: covered by Task 4.
- Next marketing app shell: covered by Task 5.
- TanStack Start product app shell: covered by Task 6.
- Verification and legacy protection: covered by Task 7.

Gaps intentionally deferred:

- Real marketing page migration.
- Blog/Fumadocs migration.
- Real Better Auth migration.
- Real Drizzle schema migration.
- Reports module migration.
- AI/Mastra migration.
- UploadThing route migration.
- Emails and Trigger jobs migration.
- Billing/Autumn migration.
- Vercel project deployment setup.

These gaps belong to later phase-specific plans.
