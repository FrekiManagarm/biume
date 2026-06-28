# Biume v2 Reset Design

Date: 2026-06-28
Status: Draft for user review

## Decision

Biume v2 is a full product, UX/UI, brand direction, and architecture reset.

The target is not to polish the current Next.js monolith. The target is to rebuild Biume with the same level of rigor used in Dunlo:

- a Turborepo monorepo;
- a dedicated public marketing app in Next.js;
- a dedicated authenticated product app in TanStack Start;
- shared packages for UI, auth, database, environment, config, emails, and AI;
- a sharper product wedge around visual anatomical reports.

Biume keeps its own visual identity. Dunlo is the reference for discipline, structure, density, conversion thinking, and craft. Biume keeps its base colors:

- primary violet: `hsl(251 73% 72%)`;
- secondary green: `hsl(148 71% 45%)`;
- neutral off-white and charcoal foundations.

The product should feel professional, precise, calm, premium, and humane. It should not feel like a generic SaaS dashboard, a generic AI tool, or a generic appointment-management product.

## Product Wedge

Biume sells the final artifact first: the anatomical report a practitioner is proud to send.

Primary promise:

> Transformez chaque consultation animale en compte rendu anatomique clair, professionnel et pret a envoyer.

The app can include agenda, clients, patients, AI, PDF export, billing, and history, but these features must support the report workflow. They should not become the main marketing promise.

The core narrative:

- the practitioner performs technical work;
- the owner often does not understand what was observed or treated;
- the report is time-consuming to write manually;
- Biume turns the session into a visual, structured, owner-friendly anatomical report;
- the practitioner gains time and looks more professional.

## Target Users

Primary users:

- independent animal osteopaths;
- canine, feline, and equine practitioners;
- small animal-health or animal-wellness practices.

The buyer, user, and decision-maker are often the same person. The interface must therefore feel both approachable and serious.

Avoid:

- "all-in-one platform" as first message;
- "Doctolib for animals" positioning;
- overclaiming medical precision;
- making AI the hero instead of the report.

## Monorepo Architecture

Target structure:

```txt
biume/
  apps/
    marketing/
      src/app/
      src/components/
      content/blog/
      package.json
    app/
      src/routes/
      src/components/
      src/functions/
      src/lib/
      vite.config.ts
      package.json
  packages/
    ui/
      src/components/
      src/styles/globals.css
      src/lib/utils.ts
      package.json
    db/
      src/schema/
      src/client.ts
      drizzle/
      package.json
    auth/
      src/server.ts
      src/client.ts
      src/permissions.ts
      package.json
    env/
      src/server.ts
      src/web.ts
      package.json
    config/
      tsconfig/
      eslint/
      package.json
    emails/
      src/
      package.json
    ai/
      src/agents/
      src/tools/
      package.json
  package.json
  turbo.json
  vercel.ts
```

This follows the Dunlo model while adapting package boundaries to Biume's larger domain surface.

## Root Tooling

The root `package.json` should use Bun workspaces:

```json
{
  "private": true,
  "workspaces": {
    "packages": ["apps/*", "packages/*"]
  },
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "check-types": "turbo check-types",
    "lint": "turbo lint",
    "dev:marketing": "turbo -F marketing dev",
    "dev:app": "turbo -F app dev",
    "db:generate": "turbo -F @biume/db db:generate",
    "db:migrate": "turbo -F @biume/db db:migrate",
    "db:studio": "turbo -F @biume/db db:studio"
  }
}
```

The `turbo.json` should define:

- `build` depending on `^build`;
- `dev` as persistent and uncached;
- `check-types`;
- `lint`;
- database tasks as uncached;
- build outputs for `.next/**`, `.vercel/output/**`, and TanStack Start/Vite outputs.

Use the text `bun.lock` format for stable Turborepo/Bun lockfile analysis.

## Marketing App

`apps/marketing` remains Next.js App Router.

Responsibilities:

- homepage;
- blog;
- SEO pages;
- comparison pages;
- legal pages;
- open graph images;
- public lead forms;
- public conversion tracking.

Initial page hierarchy:

```txt
/
/blog
/blog/[slug]
/compte-rendu-osteopathe-animalier
/compte-rendu-osteopathe-canin
/compte-rendu-osteopathe-equin
/logiciel-osteopathe-animalier
/alternatives/neovoice
/alternatives/animalib
/privacy
/cgu
/about
```

The homepage should be built like a product page, not a generic startup landing page.

Recommended homepage sections:

1. Hero: report-first promise, visual product artifact, primary CTA.
2. Problem: the value of the consultation disappears when the report is unclear or late.
3. Report artifact: anatomical schema, observations, owner-friendly explanation, PDF preview.
4. Workflow: consultation notes to visual report to owner-ready PDF.
5. Differentiation: not another agenda, a better anatomical report.
6. Use cases: dog, cat, horse.
7. Pricing: result-oriented trial, Rapport Pro, Cabinet.
8. Founder/professional trust layer.
9. FAQ.
10. Final CTA.

Primary CTA:

> Envoyez un ancien compte rendu anonymise, on le transforme en version Biume.

Secondary CTA:

> Commencer l'essai.

## Product App

`apps/app` should be TanStack Start.

Responsibilities:

- authenticated product experience;
- auth routes;
- onboarding;
- dashboard;
- clients;
- patients;
- reports;
- anatomical editor;
- agenda;
- settings;
- billing;
- API/server routes that belong to the app runtime.

TanStack Start route shape:

```txt
src/routes/
  __root.tsx
  index.tsx
  login.tsx
  signup.tsx
  onboarding.tsx
  _app.tsx
  _app/dashboard.tsx
  _app/reports.tsx
  _app/reports.$reportId.tsx
  _app/patients.tsx
  _app/patients.$patientId.tsx
  _app/clients.tsx
  _app/agenda.tsx
  _app/settings.tsx
  api/auth/$.ts
  api/chat.ts
  api/uploadthing.ts
  api/vulgarisation.ts
```

The product app should use:

- TanStack Router for routing and route-level auth guards;
- TanStack Query for client/server data coordination;
- TanStack Start server functions for app-internal mutations and reads;
- server routes for webhooks, UploadThing, chat streaming, and external integrations.

## Dashboard UX

The dashboard should be reorganized around the report lifecycle.

Primary dashboard modules:

- report in progress;
- recent reports;
- patients needing follow-up;
- upcoming appointments without report;
- anatomical history highlights;
- quick create report.

Secondary modules:

- agenda;
- client list;
- patient list;
- settings;
- billing;
- organization.

The main navigation should prioritize:

1. Accueil
2. Rapports
3. Patients
4. Clients
5. Agenda
6. Parametres

The dashboard should be denser and quieter than the marketing site. It should use Biume colors as signals, not decoration:

- violet for report/anatomy/product identity;
- green for completed, confirmed, improved, ready to send;
- neutral surfaces for work areas;
- red/orange/yellow only for clinical or workflow warnings.

## Direction Artistique

Reference: Dunlo's level of finish, not Dunlo's green identity.

Principles:

- off-white background, charcoal foreground;
- violet as the brand accent, green as action/success;
- generous whitespace on marketing;
- calm density in app;
- rounded but not toy-like;
- minimal shadows, precise borders;
- no generic purple/blue AI gradient aesthetic;
- no excessive cards;
- product visuals should look like real Biume artifacts.

Typography:

- use Geist as the default Biume v2 font because it is already present and fits a precise professional product;
- no serif in the dashboard;
- no oversized shouting H1s;
- headings should feel editorial but restrained.

Motion:

- marketing: light staggered reveals, subtle floating product panels, no noisy effects;
- app: route/nav active indicators, tactile button feedback, skeleton states;
- avoid perpetual motion in dense operational workflows unless it communicates live status.

## UI Package

`packages/ui` should own:

- shadcn primitives;
- shared Tailwind v4 globals;
- design tokens;
- shared icons/wrappers;
- common shell components only when framework-agnostic.

Do not put product-specific report workflows into `packages/ui`. Keep those in `apps/app` unless they are truly reusable primitives.

Exports:

```json
{
  "./globals.css": "./src/styles/globals.css",
  "./components/*": "./src/components/*.tsx",
  "./hooks/*": "./src/hooks/*.ts",
  "./lib/*": "./src/lib/*.ts"
}
```

## Data/Auth Packages

`packages/db` should own:

- Drizzle schemas;
- migrations;
- database client;
- shared DB types.

`packages/auth` should own:

- Better Auth server config;
- auth client;
- organization helpers;
- permission constants;
- session helpers usable by TanStack Start server functions/routes.

Inputs must remain validated with Zod or equivalent schemas. Organization isolation remains mandatory.

## AI, Emails, Billing, Jobs

Recommended package ownership:

- `packages/ai`: Mastra agents, tools, prompt helpers, context builders.
- `packages/emails`: React Email templates and rendering helpers.
- billing can begin in `apps/app` if Autumn coupling is product-specific, then move to `packages/billing` only if the boundary becomes valuable.
- Trigger jobs can begin in `apps/app/src/trigger` or a future `packages/jobs`, depending on deployment needs.

Do not over-extract too early. Extract when it reduces app coupling.

## Migration Strategy

This should be staged.

### Phase 1: Monorepo shell

- create `apps/marketing`, `apps/app`, and `packages/*`;
- move root tooling into Turbo/Bun workspace shape;
- keep existing code available while the new structure boots;
- create shared `packages/ui` from current shadcn primitives;
- create shared `packages/db`, `packages/auth`, and `packages/env`;
- verify `turbo build`, `turbo check-types`, and individual dev scripts.

### Phase 2: Marketing rebuild

- migrate marketing routes/content into `apps/marketing`;
- rebuild homepage from the new Biume v2 structure;
- preserve blog content and metadata;
- create initial SEO pages for report-intent queries;
- verify Next build and route metadata.

### Phase 3: Product app foundation

- scaffold TanStack Start in `apps/app`;
- port auth routes and session handling;
- port shell layout, navigation, providers, and onboarding;
- wire DB/auth/env packages;
- verify login/session/org boundaries.

### Phase 4: Report workflow migration

- port reports list/detail/editor;
- port anatomical visualization;
- port AI vulgarisation;
- port PDF/export;
- make report creation the central product path.

### Phase 5: Supporting modules

- port patients;
- port clients;
- port agenda;
- port settings;
- port billing;
- port emails/uploads/jobs.

### Phase 6: Cleanup

- remove obsolete root Next app after parity;
- update deployment config;
- update docs;
- run full build/typecheck/lint;
- verify Vercel project settings for each app.

## Deployment

Target:

- marketing app deployed as a Vercel Next.js project;
- product app deployed as a separate Vercel project using the TanStack Start/Nitro Vercel preset;
- shared packages built through Turbo dependency graph.

Use `vercel.ts` rather than adding new `vercel.json` logic for the reset, because current Vercel configuration guidance favors typed project config.

The local Vercel CLI should be updated before serious deployment work because the installed version is behind current releases: `npm i -g vercel@latest` or `pnpm add -g vercel@latest`.

## Testing and Verification

Minimum verification for each phase:

- `bun install`;
- `bun run check-types`;
- `bun run lint`;
- `bun run build`;
- targeted app builds with Turbo filters;
- visual QA for marketing desktop/mobile;
- auth/session route checks for app;
- report creation smoke test;
- PDF/export smoke test;
- chat/vulgarisation route smoke test;
- upload smoke test.

Known current blockers before reset:

- existing lint command currently fails from ESLint circular config;
- existing build reaches compilation then fails on an unrelated Stepper type issue;
- the repo has many non-committed changes that must not be overwritten.

These should be treated as migration context, not as reasons to mutate unrelated files during Phase 1.

## Open Risks

- Next Server Actions do not migrate one-to-one to TanStack Start server functions.
- Better Auth organization/session helpers must be adapted carefully.
- UploadThing and streaming chat routes need explicit TanStack Start server route equivalents.
- PDF generation may have runtime assumptions that differ between Next and TanStack Start.
- Shared packages can become over-abstracted if extracted before the domain boundaries are clear.
- Marketing and app deployments may require separate environment variable scopes.

## Non-Goals

- No database schema redesign in the first migration phase.
- No pricing engine rewrite in the first migration phase.
- No competitor claims without evidence.
- No fake testimonials.
- No generic all-in-one repositioning.
- No destructive deletion of the current app until the new apps reach parity.

## Approval Criteria

This spec is ready for implementation planning when the user confirms:

- Biume v2 is a total reset, not a polish pass;
- the architecture should follow the Dunlo monorepo model;
- Biume keeps its violet/green brand colors;
- the marketing promise is the anatomical report wedge;
- TanStack Start becomes the product app framework;
- migration should be staged to avoid losing existing functionality.
