# pnpm Package Manager Migration

## Background

The project currently has both npm and pnpm lockfiles. The repository should use
one package manager consistently so dependency installation and script execution
are reproducible for future work.

## Goal

Make pnpm the project package manager and remove npm-specific package management
artifacts.

## Scope

- Pin the project package manager to pnpm.
- Keep `pnpm-lock.yaml` as the only dependency lockfile.
- Remove `package-lock.json`.
- Update project-level command documentation to use pnpm.
- Verify installation, linting, and production build with pnpm commands.

## Out Of Scope

- Changing dependency versions outside what the existing pnpm lockfile already
  resolves.
- Adding package-manager enforcement hooks such as `only-allow` or `preinstall`.
- Rewriting historical requirement or change records that mention the commands
  used when those changes were implemented.

## Acceptance Criteria

- `package.json` includes `packageManager` set to `pnpm@11.4.0`.
- `pnpm-lock.yaml` is present.
- `package-lock.json` is removed.
- `AGENTS.md` lists pnpm commands for dev, build, lint, and preview.
- `README.md` documents pnpm installation and common commands.
- `pnpm install --frozen-lockfile` succeeds.
- `pnpm lint` succeeds.
- `pnpm build` succeeds.

## Open Questions

- None.
