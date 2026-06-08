# User Menu And Profile Editing

## Summary

Added an authenticated user dropdown on the home page, a profile editing page,
and a confirmed logout flow.

## Files Changed

- `src/App.tsx`
- `src/pages/home/index.tsx`
- `src/pages/profile/index.tsx`
- `src/api/profile.ts`
- `docs/requirements/2026-06-04-user-menu-profile.md`

## Verification

- `pnpm lint`
- `pnpm build`

## Impact

Authenticated users can navigate from the username menu to edit profile
information or confirm logout. Profile edits use `PUT /user/info` and update
the runtime user display after a successful response.

## Follow-Ups

- Confirm the successful response shape for `PUT /user/info`.
