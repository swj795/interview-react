# Agent Guide

This file is the long-lived collaboration guide for agents working in this repository.
It should describe project-level rules that affect future work, not details for a
single feature.

## Project Stack

- React
- TypeScript
- Vite
- React Router

## Common Commands

- `pnpm dev`: start the local Vite development server.
- `pnpm build`: run TypeScript project build and create the production build.
- `pnpm lint`: run ESLint for the repository.
- `pnpm preview`: preview the production build locally.

## Working Rules

- Read the relevant requirement document before changing code.
- Keep changes scoped to the requested feature or fix.
- Avoid unrelated refactors, formatting churn, or template cleanup unless required.
- Prefer existing project patterns before introducing new abstractions.
- After a meaningful change, maintain a change record under `docs/changes/`.
- If a change modifies project-level conventions, update this file in the same work.

## Routing

- Use React Router for page routing.
- Define user-facing routes in the React app rather than switching pages manually.
- Current auth routes are `/`, `/login`, and `/register`.

## Page Structure

- Put route page components under `src/pages/<page>/index.tsx`.
- Current page directories are `src/pages/home`, `src/pages/login`, and
  `src/pages/register`.
- Keep shared page helpers under `src/pages/shared` when they are only used by
  page-level code.

## API Structure

- Put page API request modules under `src/api/<page>.ts`.
- Keep each page's request logic in its own API module, such as
  `src/api/login.ts`, `src/api/register.ts`, or `src/api/home.ts`.
- Page components should call their page API module instead of writing request
  logic inline.

## Documentation Locations

- Requirements live in `docs/requirements/`.
- Change records live in `docs/changes/`.
- Keep feature-specific background, acceptance criteria, and implementation notes out
  of this file.

## When To Update This File

Update `AGENTS.md` when project-level rules change, including:

- Directory structure changes.
- Development, build, test, or validation commands change.
- Code style, component organization, state management, request handling, or other
  repository-wide conventions change.
- Architecture decisions are introduced that affect future development, such as
  React Router, Zustand, or TanStack Query.
- Requirement, change record, or acceptance workflow locations or formats change.
- A repeated issue should be captured as a long-lived rule.

Do not update `AGENTS.md` for:

- A small change to a single page.
- A specific bug fix record.
- Business details for one requirement.
- Temporary solutions, one-off scripts, or short-term TODO items.

Use this judgment rule: if the information affects future requirements, multiple
files, or future agents' default behavior, put it in `AGENTS.md`; if it only serves
the current requirement, put it in `docs/requirements/` or `docs/changes/`.
