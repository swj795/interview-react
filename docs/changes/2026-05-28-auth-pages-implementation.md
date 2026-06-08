# Auth Pages Implementation

## Summary

Implemented React Router routes for home, login, and registration. Added auth
forms, frontend validation, Vite proxy configuration, and runtime user
information display. Page components were split into `src/pages/home`,
`src/pages/login`, and `src/pages/register`, with shared authentication helpers
under `src/pages/shared`. Page API requests were split into `src/api`.

## Files Changed

- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `src/main.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/pages/home/index.tsx`
- `src/pages/login/index.tsx`
- `src/pages/register/index.tsx`
- `src/pages/shared/auth.ts`
- `src/api/home.ts`
- `src/api/login.ts`
- `src/api/register.ts`
- `AGENTS.md`
- `docs/requirements/2026-05-28-auth-pages.md`

## Verification

- `npm run lint`
- `npm run build`

## Impact

- `/login` supports email/password login through `POST /user/login`.
- `/register` supports username/email/password registration through
  `POST /user/register`.
- Successful registration navigates to `/login` and prompts the user to sign in.
- `/` displays the current runtime username and email or an unauthenticated
  empty state.
- Unknown routes redirect to `/login`.
- Local API calls use `/user/*` and are forwarded by Vite proxy to
  `http://localhost:3000`.
- Page components call page API modules under `src/api` instead of maintaining
  request logic inline.

## Follow-Ups

- Confirm backend password length rules.
- Confirm successful response shapes and token behavior.
- Decide whether authenticated state should persist across page refreshes.
