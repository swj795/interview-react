# Home Navigation Welcome Layout

## Summary

Changed the home page from a profile details view to an app-shell layout with a
full-width navigation bar and centered welcome message.

## Files Changed

- `src/pages/home/index.tsx`
- `src/index.css`
- `docs/requirements/2026-05-28-auth-pages.md`

## Verification

- `npm run lint`
- `npm run build`

## Impact

- The home page navigation spans the full browser width.
- The navigation shows the Vite logo on the left and the current user's display
  name on the right.
- The home page body now shows a welcome message instead of username and email
  detail rows.

## Follow-Ups

- Replace the temporary Vite logo when the final product logo is available.
