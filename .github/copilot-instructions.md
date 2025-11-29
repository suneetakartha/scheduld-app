## Purpose

Short, actionable guidance for AI coding agents working in this repository. Focus on the project's structure, key workflows (how to run/build), conventions, and the most important integration points to avoid wasted edits.

## Quick start (developer workflows)
- Node engine requirement: defined in `package.json` (Node >= 20.19.0 or >= 22.12.0). Use that when running CI or local installs.
- Install: `npm install`
- Dev (hot reload): `npm run dev` (Vite)
- Build: `npm run build`
- Preview build: `npm run preview`

Files to check first: `package.json`, `index.html`, `src/main.ts`, `README.md`.

## Big-picture architecture
- Frameworks: Vue 3 + Vite. UI styling via Tailwind CSS (see `tailwind.config.js` and `src/styles/styles.css`).
- State: Pinia stores (composition-style). Stores live in `src/modules/shared/stores/` (e.g. `useAuth.ts`, `useShiftsStore.ts`).
- App is organized by domain under `src/modules/` — top-level folders: `business`, `shared`, `worker`. Each module contains its own `router.ts` and `views/` folder.
- Router: central router at `src/router/index.js` (shared route definitions in `router/routes.shared.ts`).
- Entry point: `index.html` mounts `src/main.ts` — prefer `src/main.ts` (it wires Pinia and `useAuth()` restore logic). `src/main.js` exists but is not the active entry.

Why this matters: changes to state shape or store APIs require edits across `modules/*/views` and `modules/shared/stores` since views consume stores via `storeToRefs` and composition-style stores.

## Project-specific conventions & patterns
- Stores: defined with `defineStore('name', () => { ... })` and return state, getters, actions. Consumers use `storeToRefs(store)` in components.
- Fetching pattern: `useShiftsStore.fetchShifts(args)` takes either `{ role, month }` or `{ role, start, end }`. Current implementation uses local mock data in `useShiftsStore.ts` — swap with real API calls there when integrating backends.
- UI modules: `modules/*/views` contain page-level components. Shared UI components live in `src/components/` and `src/layouts/`.
- Types: Project uses TypeScript in places (`src/main.ts`, stores) but also contains `.js` files. Confirm `index.html` points to `src/main.ts` which is the canonical boot file.
- Styling: Tailwind utilities + single global CSS at `src/styles/styles.css`. Keep classes utility-first; components already rely heavily on Tailwind.

## Integration points & external dependencies
- Vite dev server and build (see `vite.config.js`).
- Pinia (state), Vue Router, Tailwind/PostCSS. PrimeIcons is present as a dependency but commented imports may be used in components.
- Public assets: the `public/` folder contains static assets and small public pages (e.g., `public/business/`, `public/login/`). Use `/public` paths or `/`-relative references.
- Backend: there is no live API wired; `useShiftsStore.fetchShifts` contains the canonical mock and is the recommended place to swap in HTTP calls (axios/fetch). Keep the current `FetchArgs` shape when implementing endpoints.

## Things to watch for (edge cases & gotchas)
- Dual mains: two boot files exist (`src/main.ts` and `src/main.js`) — `index.html` uses `src/main.ts`. Make edits against `main.ts` for global wiring (Pinia, auth restore).
- No test scripts are present in `package.json` — runs and CI may not include tests by default.
- Store-to-view coupling: many views expect specific fields (e.g., `Shift` shape in `useShiftsStore.ts`). Changing property names requires coordinated updates in views like `src/modules/business/views/Schedule/ShiftMain.vue`.

## Quick examples (where to change things)
- Wire API for shifts: update `src/modules/shared/stores/useShiftsStore.ts` (replace mock block in `fetchShifts` with HTTP call). Keep returned array shape matching the `Shift` interface in the same file.
- Entry-level app wiring (Pinia/auth): edit `src/main.ts` — `useAuth().restoreFromStorage()` and `bindStorageSync()` are called here.
- Add routes: check `src/router/index.js` and `router/routes.shared.ts` for route organization.

## What to do if uncertain
- Prefer minimal, local changes and run `npm run dev` to verify UI. Open the browser with Vite and use Vue Devtools.
- When modifying stores, run the app and check components that import those stores (`modules/*/views`) to avoid regressions.

## After editing
- If you add runtime dependencies, update `package.json` and note the Node engine constraint.

---
If any of the above is unclear or you'd like more detail (example PR patterns, preferred commit messages, test suggestions), tell me which section to expand and I'll iterate.
