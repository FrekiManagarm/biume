---
name: autumn
description: Intègre et fait évoluer Autumn (billing open-source, Stripe) dans Biume — config atmn, SDK serveur autumn-js, handler Next, useCustomer côté client, et garde les IDs alignés. Utiliser lors de facturation, abonnements, essais, portails checkout, contrôle d’accès aux features, ou quand le code mentionne autumn-js, AutumnProvider, autumn.config, ou AUTUMN_SECRET_KEY.
---

# Autumn (Biume)

## Rôle d’Autumn

Autumn est le moteur de **plans, essais et limites** branché sur **Stripe**. Il sait quel client (ici l’**organisation**) a droit à quoi ; l’app **vérifie** l’accès et **déclenche** le checkout via le SDK React.

Documentation officielle : [https://docs.useautumn.com](https://docs.useautumn.com)

## Fichiers à connaître dans ce dépôt

| Fichier | Rôle |
|---------|------|
| `autumn.config.ts` | Définit **features** (`feature`), **plans** (`plan`) et **items** (`item`) avec le package `atmn`. Les `id` viennent de `lib/constants/autumn-ids.ts`. |
| `lib/constants/autumn-ids.ts` | **Source unique des chaînes d’id** (features + plans), importable **côté client** sans tirer `autumn.config`. |
| `lib/utils/autumn.ts` | Instance serveur `new Autumn({ secretKey: process.env.AUTUMN_SECRET_KEY })` — **jamais** exposer la clé au client. |
| `app/api/autumn/[...all]/route.ts` | `autumnHandler` : associe la requête au **customer Autumn** = **id d’organisation** Better Auth (`identify` via `auth.api.getFullOrganization`). |
| `lib/context/providers.tsx` | `AutumnProvider` (`autumn-js/react`) avec `betterAuthUrl` / credentials selon l’environnement. |

## Règles strictes

1. **Nouvel id de feature ou de plan** : ajouter la constante dans `lib/constants/autumn-ids.ts`, puis l’utiliser dans `autumn.config.ts` et partout ailleurs. Ne pas dupliquer des chaînes magiques.
2. **Composants client** : importer les ids depuis `@/lib/constants/autumn-ids` — **ne pas** importer `autumn.config.ts` côté client (dépendance `atmn` / Node).
3. **Secrets** : uniquement `AUTUMN_SECRET_KEY` côté serveur (`lib/utils/autumn.ts`, routes API, actions serveur).
4. **Customer** : l’identifiant Autumn aligné sur l’**organisation** ; la création / suppression de client côté Autumn est orchestrée avec Better Auth (voir `lib/auth/auth-server.ts` et flux org).

## Côté client (UI)

- Hook **`useCustomer()`** depuis `autumn-js/react` : `check({ featureId })`, état de chargement, checkout.
- Exemple de garde feature : `check({ featureId: autumnFeatureIds.iaVulgarisation }).allowed` (voir `components/dashboard/pages/settings/components/profile/profile-ai-section.tsx`).
- Composants checkout / onboarding : `autumnPlanIds` pour choisir le plan (mensuel / annuel), ex. `billing-tab.tsx`, `subscription-step.tsx`, `non-payed-subscription-modal.tsx`.

## Côté serveur

- Appels **`autumn.customers.*`** (ex. `getOrCreate`, `get`, `delete`) via `@/lib/utils/autumn` dans les actions serveur ou hooks auth — pas de clé en dur.
- Après des changements qui impactent le client Autumn côté org, **`revalidatePath("/api/autumn")`** peut être nécessaire pour rafraîchir le cache (voir actions organisation).

## Ajouter une feature produit

1. Ajouter l’id dans `autumnFeatureIds` (`lib/constants/autumn-ids.ts`).
2. Exporter un `feature({ id, name, type })` dans `autumn.config.ts` et l’attacher aux bons `plan` via `item({ featureId, included: ... })`.
3. Côté UI : `useCustomer().check({ featureId })` ou logique serveur selon le besoin.
4. Déployer / synchroniser la config avec le dashboard Autumn si le workflow du projet l’exige (voir doc Autumn « Products »).

## Anti-patterns

- Importer `autumn.config` dans un fichier `"use client"`.
- Hardcoder des ids de features/plans en dehors de `autumn-ids.ts`.
- Utiliser la secret key Autumn dans le navigateur ou dans `NEXT_PUBLIC_*`.

## Ressources additionnelles

- Produits et items : [Product Items](https://docs.useautumn.com/products/product-items)
- Pour détails API récents ou billing flows, consulter la doc officielle et les types `autumn-js` / `atmn` installés dans le projet.
