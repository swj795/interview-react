# Auth Pages

## Background

The project needs basic authentication pages for email login and user
registration. Swagger UI at `http://localhost:3000/api#/` confirms the current
user endpoints:

- `POST /user/register`
- `POST /user/login`

Swagger confirms the request DTOs for registration and login. Password length
rules and response shape still need backend confirmation.

## Goal

Build a concise login and registration experience that supports frontend form
validation and calls the user authentication APIs.

## Scope

- Add a login page at `/login`.
- Add a registration page at `/register`.
- Add a home page at `/`.
- Implement route page components under `src/pages/home/index.tsx`,
  `src/pages/login/index.tsx`, and `src/pages/register/index.tsx`.
- Maintain page API requests under `src/api/login.ts`, `src/api/register.ts`,
  and `src/api/home.ts`.
- Redirect unmatched routes to `/login`.
- Login form fields:
  - `email`
  - `password`
- Registration form fields:
  - `username`
  - `email`
  - `password`
- Validate email format before submitting either form.
- Validate password as required before submitting either form. Password length
  validation is deferred until backend rules are confirmed.
- Submit login requests to `POST /user/login` with a JSON body matching the
  login form fields.
- Submit registration requests to `POST /user/register` with a JSON body
  matching the registration form fields.
- Provide navigation links between the login and registration pages.
- Show a success message after a successful submit.
- If the login API response includes a token, save the token in
  `sessionStorage` under `interview-react.authToken`.
- After successful login, save the token, save current user information in
  frontend runtime state, and navigate to `/`.
- After successful registration, navigate to `/login` and show a registration
  success prompt on the login page.
- The home page calls `GET /user/info` with the saved token in the
  `Authorization: Bearer <token>` request header.
- The home page shows a full-width navigation bar with the Vite logo on the left
  and the user's display name on the right.
- The home page body shows a welcome message. If no token or no user information
  is available, it shows an unauthenticated empty state and a login link.
- Frontend requests use relative paths and Vite dev proxy forwards `/user/*` to
  `http://localhost:3000`.
- Show an error message after a failed submit.
- Keep user-entered form values after failed submits.

## API Contracts

### Register

- Method: `POST`
- Path: `/user/register`
- Content-Type: `application/json`
- Request DTO:

```json
{
  "username": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Login

- Method: `POST`
- Path: `/user/login`
- Content-Type: `application/json`
- Request DTO:

```json
{
  "email": "example@example.com",
  "password": "password"
}
```

## Out Of Scope

- Social login or third-party authentication.
- Password reset.
- Email verification.
- Persistent logged-in user profile display.
- Protected route implementation.
- Mandatory post-submit redirect.
- Final token storage policy.
- Persisting authenticated state across page refreshes.

## Acceptance Criteria

- Visiting `/login` shows a simple login form with `email` and `password`.
- Visiting `/register` shows a simple registration form with `username`,
  `email`, and `password`.
- Both forms block submit and show a validation message when the email format is
  invalid.
- Both forms block submit and show a validation message when password is empty.
- Login submit sends a JSON request to `POST /user/login`.
- Registration submit sends a JSON request to `POST /user/register`.
- Frontend code requests `/user/login` and `/user/register`, with Vite proxy
  forwarding to `http://localhost:3000`.
- Login and registration page components call API modules instead of writing
  request logic inline.
- Login page includes a link to the registration page.
- Registration page includes a link to the login page.
- Successful login saves user information and navigates to `/`.
- Successful registration navigates to `/login` and prompts the user to sign in.
- Home page displays a full-width navigation bar and a welcome message, or an
  unauthenticated empty state if no user information exists.
- If a successful login API response includes a token, the implementation stores
  it in `sessionStorage` under `interview-react.authToken`.
- Home page user info requests include `Authorization: Bearer <token>`.
- Failed submit shows an error message and preserves the entered form values.

## Open Questions

- What are the final minimum and maximum password length rules?
- What is the successful response shape for `POST /user/login` beyond supported
  token fields?
- What is the successful response shape for `POST /user/register`?
- Should long-term production authentication move token persistence to an
  `HttpOnly`, `Secure`, `SameSite` cookie?
