# pnpm Package Manager Migration

## Summary

Changed the project package management convention from npm to pnpm.

## Files Changed

- `package.json`
- `package-lock.json`
- `pnpm-lock.yaml`
- `AGENTS.md`
- `README.md`
- `docs/requirements/2026-06-01-pnpm-package-manager.md`
- `docs/changes/2026-06-01-pnpm-package-manager.md`

## Verification

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm build`

## Impact

Future dependency installs and project scripts should use pnpm. The npm lockfile
has been removed to avoid competing dependency lock sources.

## Follow-Ups

- None.
