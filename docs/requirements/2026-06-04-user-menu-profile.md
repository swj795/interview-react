# User Menu And Profile Editing

## Background

The home page currently displays the authenticated user's display name in the
top navigation. Users need account actions from that display name, including
profile editing and logout.

## Goal

Add a username dropdown menu, a profile editing route, and a confirmed logout
flow.

## Scope

- Clicking the username in the home navigation opens a dropdown menu.
- The dropdown includes:
  - `修改信息`
  - `退出登录`
- `修改信息` navigates to the `/profile` route.
- `/profile` renders a user profile page component under
  `src/pages/profile/index.tsx`.
- The profile page allows editing `username` and `email`.
- If the profile page has a token but no user information, it requests
  `GET /user/info`.
- Profile updates submit `PUT /user/info` with `Authorization: Bearer <token>`
  and a JSON body containing `username` and `email`.
- `退出登录` opens an in-app confirmation dialog.
- Confirming logout clears the stored token, clears runtime auth state, and
  navigates to `/login`.

## Out Of Scope

- Password changes.
- Avatar upload.
- Protected route architecture beyond redirecting `/profile` without a token.
- Backend API contract changes.

## Acceptance Criteria

- Clicking the home page username opens a dropdown menu.
- Clicking `修改信息` navigates to `/profile`.
- Visiting `/profile` without a token redirects to `/login`.
- Visiting `/profile` with a token displays a username and email form.
- Submitting the profile form validates that username is present.
- Submitting the profile form validates email format.
- Successful profile submit sends `PUT /user/info` with token authorization.
- Successful profile submit updates runtime user information.
- Clicking `退出登录` opens a confirmation dialog.
- Cancelling logout leaves the user on the current page and keeps auth state.
- Confirming logout clears the token and navigates to `/login`.

## Open Questions

- Confirm the exact successful response shape for `PUT /user/info`.
