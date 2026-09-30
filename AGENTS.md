<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Worbee project guidance

## Project context

Worbee is an interactive workspace builder for a furniture-rental service. Users choose isometric furniture sprites, drag or tap them onto a 2D workspace, then review their rental-ready setup.

Treat these root documents as authoritative:

- [`prd.md`](prd.md) — product scope and acceptance criteria.
- [`design.md`](design.md) — visual system, component behavior, and sprite art direction.
- [`architecture.md`](architecture.md) — front-end structure, state ownership, and placement rules.
- [`task.md`](task.md) — implementation checklist.

Implement only the current request and required PRD behavior. Do not add a backend, payments, authentication, real 3D, or speculative integrations unless the user explicitly expands the scope.

## Working agreements

- Inspect related code, tests, and the relevant project document before editing.
- Make the smallest complete change that meets the request.
- Preserve established conventions; keep implementation, tests, documentation, and configuration consistent.
- Prefer direct, readable TypeScript over clever code.
- Do not add speculative features, abstractions, or dependencies.
- Run the smallest relevant check first, then broader required checks before finishing.
- Never commit secrets, `.env` files, generated dependencies, or build output.
- Use `rtk` for shell commands when it is available; otherwise use the direct command.

## Required stack

- Next.js App Router with TypeScript.
- Tailwind CSS for styling.
- npm and the committed root `package-lock.json`; do not add pnpm, Yarn, Bun, or another lockfile.
- Vercel-compatible production builds.
- Layered HTML/CSS isometric scene with transparent PNG/WebP sprites. Do not add WebGL or a 3D engine for the MVP.
- Native Pointer Events for dragging. Do not add a drag-and-drop library unless a concrete, tested limitation requires it.
- Use Zustand for shared workspace configuration, React Hook Form plus Zod for the enquiry form, and `localStorage` for persisted drafts when those features are implemented.
- Use Vitest and React Testing Library when introducing tests.

Install a dependency only in the change that uses it.

## Structure and boundaries

Keep the application at the repository root. Do not introduce a monorepo or `src/` directory without an explicit architecture decision.

```text
app/                         # Routes, layouts, route-level composition
components/
  builder/                    # Workspace canvas, products, scene controls
  checkout/                   # Setup review and enquiry UI
  ui/                         # Generic reusable primitives
hooks/                        # Reusable interaction behavior
lib/                          # Catalogue, placement, pricing, state, persistence
types/                        # Shared app types
public/assets/
  scene/                      # Room and floor artwork
  sprites/                    # Transparent furniture and accessory assets
```

- Route and global layout code belongs in `app/`.
- Builder- and checkout-specific code stays in its feature folder; generic UI stays in `components/ui/`.
- Feature modules must not import another feature’s private code. Extract a focused shared module instead.
- Import concrete files; do not add barrel files only for re-exporting.
- Keep React components focused on rendering, interaction, and composition.
- Keep placement geometry, collision checks, coordinate conversion, and pricing in pure modules or hooks—not JSX.
- Keep local UI state local. The workspace store owns only shared configuration and interaction state, never duplicate catalogue data or totals.
- Derive quantities and monthly totals from placed items plus the catalogue.
- Use `'use client'` only for browser interaction, state, or browser APIs. Never access `window`, `localStorage`, or Pointer Events during server rendering.

## Sprite scene and placement

- All sprites share one front-left isometric perspective, scale family, lighting direction, line weight, and contact-shadow style.
- Individual sprites must be transparent outside the object and minimal contact shadow; they must not include a room backdrop, floor gradient, text, logo, or watermark.
- Catalogue metadata includes product ID, category, monthly price, sprite dimensions, floor-contact anchor, footprint, allowed surfaces, and quantity limit.
- Store placement in stable canvas coordinates, not raw viewport pixels.
- `lib/placement.ts` is the sole owner of snapping, bounds, compatible surfaces, collisions, and scene depth. UI components must not copy this logic.
- Floor furniture snaps to valid floor positions. Monitors, lamps, keyboards, and desk plants can only use a compatible desk surface.
- Provide tap-to-place and keyboard-accessible placement as alternatives to dragging.
- Invalid drops are prevented and explained with visible text as well as visual feedback.
- Replacing a primary desk or chair requires confirmation or an immediate Undo option.

## Design rules

[`design.md`](design.md) is the visual authority.

- Keep the isometric canvas visually dominant over controls.
- Use white and soft off-white surfaces; use ink (`#111827`) for primary actions and a limited coral (`#dc2626`) accent.
- Organize with thin borders. Do not use heavy shadows on cards, sprites, or main panels.
- Use fully rounded pill shapes for interactive buttons, tabs, and tags; use modest rounding for panels and cards.
- Use Inter or its configured system fallback and tabular numerals for prices, quantities, and totals.
- Maintain keyboard focus, accessible labels, text-supported status feedback, and reduced-motion support.
- Do not turn the builder into a dense ecommerce grid or obscure the primary rent action with the canvas.

## Data, forms, and persistence

- Keep the product catalogue in one typed module: product ID, name, category, price, sprite metadata, and placement capabilities.
- Use Zod for enquiry-form and persisted-draft validation when those features are added; infer TypeScript types from schemas where practical.
- Never cast unknown browser-stored data to a workspace type. Parse it first; malformed or unavailable drafts must safely start from an empty workspace.
- Keep inline form errors close to affected fields. Transient messages supplement—not replace—durable visible feedback.
- Do not add API clients, server contracts, database models, or server-response schemas until an integration is explicitly authorized.

## Naming

- Preserve Next.js conventions exactly: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `route.ts`.
- Use PascalCase components and component filenames: `WorkspaceCanvas.tsx`.
- Use camelCase `use`-prefixed hooks: `useWorkspaceDrag.ts`.
- Use focused lowercase utility names: `placement.ts`, `pricing.ts`, `catalog.ts`.
- Use PascalCase for React components and types; use camelCase for functions and variables.
- Name tests `*.spec.ts` or `*.spec.tsx`; avoid vague filenames such as `helpers.ts`, `common.ts`, or `misc.ts`.

## Testing and verification

- Start with the simplest meaningful test; keep tests deterministic and behavior-focused.
- Prefer explicit assertions over snapshots. Add a focused regression test for a testable bug.
- Unit-test pure placement and pricing rules: snapping, bounds, collisions, compatible surfaces, quantity limits, and totals.
- Component-test meaningful visible behavior: selection, valid/invalid placement, removal, reset, summary updates, and tap-to-place.
- Mock only browser boundaries such as `localStorage` or pointer setup—not the placement logic under test.
- Do not test framework internals, Tailwind classes, or trivial accessors.
- Run `npm run lint` for TypeScript, Tailwind, or configuration changes.
- Run `npm run build` before declaring meaningful front-end work complete.
- When tests exist, run the smallest affected test first and the complete relevant suite before a user-authorized push or pull request.

## Engineering principles

- Apply KISS: choose the smallest design that clearly handles today’s requirement.
- Apply YAGNI: do not create generic systems for hypothetical furniture, zones, or integrations.
- Apply DRY to stable rules such as placement geometry and pricing; do not merge unrelated rules for superficial similarity.
- Prefer composition and focused hooks/functions over inheritance.
- Make invalid states difficult to represent through precise product categories, placement surfaces, and typed state.
- Handle user input and browser-storage failures explicitly; never silently swallow them.

## Branch, commit, and pull request rules

- Before editing, check the current branch with `git branch --show-current`.
- Develop each logical change on a dedicated branch; never change `main`, `master`, or `trunk` directly.
- Unless the user requests another name, use `codex/<type>-<short-kebab-case-description>`.
- Keep one logical change set per branch. Preserve unrelated uncommitted work and ask for direction if it prevents safe branching.
- Create commits only when the user asks. Use `<type>(<scope>): <imperative description>`, for example `feat(builder): add placement preview`.
- Push or create a pull request only when the user explicitly asks. Before pushing, run all required checks and report their successful results.

## Definition of done

- The change satisfies the user request and applicable [`prd.md`](prd.md) acceptance criteria.
- It respects the project’s component, state, sprite, and design boundaries.
- Relevant tests, linting, and the production build pass.
- UI changes include suitable empty, selected, valid, invalid, loading, and error states where applicable.
- No unrelated dependency, refactor, or scope expansion was added.
- Documentation changes alongside externally visible behavior, architecture, visual rules, or setup changes.
