# Login Token User Info

## Summary

Persisted login tokens in `sessionStorage` and added authenticated home page
user info loading through `GET /user/info`.

## Files Changed

- `src/App.tsx`
- `src/api/home.ts`
- `src/pages/home/index.tsx`
- `src/pages/login/index.tsx`
- `src/pages/shared/auth.ts`
- `docs/requirements/2026-05-28-auth-pages.md`

## Verification

- `npm run lint`
- `npm run build`

## Impact

- Login now requires a returned token before navigating to `/`.
- The token is stored under `interview-react.authToken` in `sessionStorage`.
- Home page requests include `Authorization: Bearer <token>` and render the
  returned username and email.
- Home page shows loading, unauthenticated, and failed-request states.

## Follow-Ups

- Confirm the production token policy with the backend; `HttpOnly`, `Secure`,
  `SameSite` cookies are preferred when the frontend does not need direct token
  access.
