# Tailwind CSS Integration

## Background

The project currently uses global CSS and page-level classes for the auth and
home pages. The frontend should support Tailwind CSS utilities while preserving
the existing React, TypeScript, Vite, and React Router structure.

## Goal

Introduce Tailwind CSS through the Vite build pipeline and migrate the current
page-level auth and home styling to Tailwind utility classes without changing
the user-facing design.

## Scope

- Install Tailwind CSS v4 and the official Vite plugin.
- Configure Vite to run the Tailwind plugin alongside the React plugin.
- Import Tailwind from the global stylesheet.
- Preserve existing global CSS variables, base typography, dark-mode variables,
  and root layout rules.
- Migrate login, registration, and home page layout and component styling from
  `src/App.css` to Tailwind utility classes.
- Remove the unused page-level stylesheet import after migration.
- Keep API behavior, routing behavior, form validation, and auth state behavior
  unchanged.

## Out Of Scope

- Redesigning the login, registration, or home pages.
- Adding a custom Tailwind theme or `tailwind.config.js`.
- Introducing a component library or new state management.
- Changing authentication API contracts or token storage behavior.

## Acceptance Criteria

- `tailwindcss` and `@tailwindcss/vite` are listed as development dependencies.
- Vite includes the Tailwind CSS plugin.
- `src/index.css` imports Tailwind CSS.
- Login, registration, and home pages render with Tailwind utility classes for
  their page-level styling.
- The current layout, colors, spacing, form focus states, messages, disabled
  button state, and dark-mode colors remain visually consistent.
- `src/App.tsx` no longer imports `src/App.css`.
- No unused `src/App.css` page-level stylesheet remains.
- `npm run build` succeeds.
- `npm run lint` succeeds.

## Open Questions

- None.
