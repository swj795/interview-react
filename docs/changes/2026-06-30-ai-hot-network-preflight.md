# AI HOT Network Preflight

## Summary

Added network preflight and push scripts for the AI HOT Feishu automation. The
preflight checks DNS resolution and outbound HTTPS access for the two required
domains before the automation attempts to fetch AI HOT items or send the Feishu
webhook. The push script gives the automation a fixed command that can reuse an
approved external-network command prefix.

## Files Changed

- `package.json`
- `scripts/check-ai-hot-network.mjs`
- `scripts/push-ai-hot-feishu.mjs`
- `docs/changes/2026-06-30-ai-hot-network-preflight.md`

## Verification

- `pnpm check:ai-hot-network`
- `pnpm push:ai-hot-feishu`

The check currently fails inside the restricted sandbox because outbound DNS is
blocked, which is the expected diagnostic result for the current incident. The
same command succeeds when run with approved external-network execution.

## Impact

Future AI HOT runs can fail early with a precise environment diagnosis instead
of being misread as an AI HOT API, Feishu webhook, or message formatting issue.
The full push now has a stable command prefix for approval reuse.

## Follow-Ups

- Allow DNS resolution and outbound HTTPS access for `aihot.virxact.com` and
  `open.feishu.cn` in the automation runner.
