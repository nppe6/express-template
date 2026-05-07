---
status: active
created: 2026-05-07
updated: 2026-05-07
---

# Express Template Upgrade Plan

## Summary

This repository is currently a lightweight `Express + TypeScript + Prisma` starter that now has Prisma upgraded and working on `6.19.3`, but still carries an older application skeleton. The biggest gap is no longer the ORM version. It is the mismatch between a modern runtime stack and an older app structure: Express/runtime typing drift, outdated TypeScript target, split config sources, mixed auth strategy, weak error handling, and several unused dependencies.

The goal of this plan is not to turn the repo into a large framework. It is to turn it into a clean, modern, maintainable API starter that matches current Express + TypeScript project conventions while preserving the repo's small size and Prisma/MySQL foundation.

## Scope

### In Scope

- Align the runtime/tooling baseline with current Express + TypeScript practices
- Normalize startup, configuration, error handling, and health-check behavior
- Simplify auth and API validation design
- Keep Prisma on the current stable `6.19.x` line
- Remove obviously unused dependencies and dead template baggage
- Add the minimum testing and developer workflow foundation expected from a modern starter

### Out of Scope

- Migrating Prisma to v7 in this pass
- Introducing MongoDB in this pass
- Building a full business domain beyond the starter's existing user example
- Adding a large plugin/module architecture

---

## Current-State Findings

- Prisma upgrade is effectively complete: `prisma generate`, `prisma validate`, and `tsc --noEmit` pass.
- Express is still on runtime v4 while types are on v5, creating an avoidable mismatch in `package.json`.
- The TypeScript compiler target is still `es5`, which is out of date for Node 22.
- Routes are registered after `app.listen`, which makes startup flow harder to reason about.
- App config is split between `.env` and `config/default.ts`, with secrets still hardcoded in config.
- JWT middleware is the primary API auth path. `express-session` is intentionally kept for the graphic captcha flow, so it should be treated as captcha infrastructure rather than a competing login/session auth model.
- The current user route is not REST-shaped: `GET /users` validates login credentials from the request body.
- Error handling is still based on local wrapper style instead of centralized middleware.
- Several installed packages are not connected to real request flows.

---

## Phase 1: Modernize the Runtime Baseline

### Goal

Bring the project onto a clean modern Node/Express/TypeScript footing without changing the domain model.

### Why First

This phase reduces technical drag for all later changes. It also removes the largest mismatch between the current repo and current Express + TypeScript starter practices.

### Files Likely Touched

- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `src/app.ts`
- `src/router/index.ts`
- `README.md`

### Planned Changes

1. Align Express runtime and typing strategy
- Prefer moving to `express@5.x` so runtime and types match current maintained conventions.
- Re-verify existing middleware usage against Express 5 behavior.

2. Modernize the TypeScript runtime target
- Raise `target` from `es5` to `ES2022`.
- Add explicit module resolution and other Node-friendly compiler options as needed.
- Keep output simple and compatible with the current CommonJS shape unless there is a strong reason to move module systems now.

3. Upgrade the dev workflow
- Replace `ts-node-dev` with `tsx` for local development.
- Add `build`, `start`, `test`, `lint`, and `format` scripts.
- Keep existing Prisma scripts and preserve the working Prisma 6.19.x flow.

4. Fix startup lifecycle order
- Register middleware and routes before calling `listen`.
- Return or retain the server instance for future graceful shutdown support.

5. Add baseline health endpoints
- Add `GET /health`.
- Add `GET /api/health`.
- Optionally add a version/build info endpoint if useful.

### Validation

- `pnpm dev` starts successfully
- `pnpm typecheck` passes
- `pnpm build` passes
- Root route and health routes respond as expected
- No runtime/type mismatch remains between Express packages

### Test Expectation

- Add API smoke coverage for health endpoints
- Add at least one startup-path integration test if a test harness is introduced in this phase

---

## Phase 2: Normalize Configuration, Errors, and Auth

### Goal

Make the starter operationally coherent by centralizing configuration, standardizing errors/responses, and choosing one primary auth model.

### Why Second

Once the runtime/tooling base is stable, this phase removes the highest-impact structural inconsistencies in app behavior.

### Files Likely Touched

- `config/default.ts`
- `.env.example` or equivalent new env doc file
- `package.json`
- `src/app.ts`
- `src/middleware/index.ts`
- `src/middleware/jwt/index.ts`
- `src/middleware/types.d.ts`
- `src/utils/commonRes.ts`
- `src/utils/logger.ts`
- `src/utils/silentHandle.ts`
- New error middleware files under `src/middleware/`

### Planned Changes

1. Unify configuration
- Stop hardcoding secrets in `config/default.ts`.
- Move secrets and connection-sensitive values into environment variables.
- Add a typed env/config loader with startup-time validation.
- Keep non-sensitive defaults only where they genuinely help local development.

   Proposed env validation design:
   - Validate configuration when `src/config/app.config.ts` is imported, so invalid runtime configuration fails before the HTTP server starts.
   - Required variables:
     - `DATABASE_URL`: required; must be a non-empty connection string.
     - `JWT_SECRET`: required; must be a non-empty secret and should not silently fall back to a hardcoded production secret.
   - Optional variables with safe defaults:
     - `PORT`: optional; defaults to `3000`; when provided, it must parse to a valid TCP port.
     - `API_PREFIX`: optional; defaults to `/api`; when provided, it should start with `/`.
     - JWT token lifetime should stay in the JWT module for now because the existing remember-me flow uses a runtime parameter: default `1` day, or `7` days when remember-me is selected.
   - Fail-fast behavior:
     - Missing or malformed required config should throw a clear startup error that names the invalid variable.
     - The app should not continue with placeholder secrets such as `express-template` when `JWT_SECRET` is missing.
   - Implementation direction:
     - Keep the first pass small and local to `app.config.ts`.
     - Prefer a typed parser such as `zod` if it is introduced for Phase 2/3 validation, otherwise implement a small explicit parser without adding a new dependency only for env validation.
     - Keep `.env.example` in sync with every supported environment variable and document which variables are required.

2. Standardize logging and request context
- Keep `pino`, but clean up logger integration.
- Add request-aware logging, ideally through middleware rather than scattered `console.log`.
- Introduce request identifiers if the implementation stays small enough to justify it.

3. Replace local error-wrapping with centralized error middleware
- Move away from relying on `silentHandle` as the main error propagation pattern.
- Add not-found middleware.
- Add centralized error middleware for validation, auth, and unexpected failures.

4. Normalize response protocol
- Keep the response wrapper lightweight, but make it predictable.
- Separate HTTP status from business code semantics.
- Fix clearly incorrect status usage such as JWT expiry returning `402`.

5. Choose a primary auth path
- Prefer JWT for API authentication in this repo's current API-first shape.
- Keep `express-session` for the graphic captcha flow, and avoid expanding it into a general login/session auth model unless the product scope changes.
- Keep `svg-captcha` if the captcha route is retained or implemented in the near term.
- Stop hashing the JWT secret with `md5`.
- Define an explicit token payload type.

### Validation

- App starts with validated config
- Missing required env vars fail fast with a useful startup error
- `JWT_SECRET` has no silent hardcoded fallback in the finalized config loader
- `.env.example` documents all required and optional config variables
- Auth failures return consistent statuses and response shape
- Unhandled exceptions route through one global error path
- No `console.log` remains in request/auth flow

### Test Expectation

- Validation error path test
- Unauthorized request test
- Invalid token test
- Happy-path authenticated request test

---

## Phase 3: Repair API Semantics and Trim Template Baggage

### Goal

Make the starter's public shape and dependency surface match what it actually does, while adding a minimal sustainable testing/documentation baseline.

### Why Third

This phase depends on the runtime/config/error/auth cleanup from Phases 1 and 2. Once those are stable, the route and dependency cleanup becomes straightforward.

### Files Likely Touched

- `src/router/user.ts`
- `src/router/module/index.ts`
- `src/controller/userController.ts`
- `src/service/userService.ts`
- `src/dao/userDao.ts`
- `src/middleware/validator/user.validator.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `package.json`
- `README.md`
- New test files under a `tests/` or `src/**/__tests__` layout

### Planned Changes

1. Repair route semantics
- Replace the current `GET /users` plus body validation shape with clearer endpoints.
- A likely minimum set:
  - `POST /api/auth/login`
  - `GET /api/users/me`
  - `GET /api/users`
- Keep this small; the goal is clean starter semantics, not full auth product scope.

2. Improve validation design
- Prefer moving request validation to `zod`, at minimum for env and request body/query params.
- If `express-validator` remains temporarily, narrow it to the real route semantics.

3. Clarify service/DAO boundaries
- Keep DAO focused on persistence access.
- Keep service focused on business and auth decisions.
- Keep controller focused on request/response orchestration.

4. Clean unused dependencies
- Reassess and likely remove:
  - `mongoose`
  - `@types/mongoose`
  - `multer`
  - `svg-captcha` only if the graphic captcha flow is removed or deferred
  - `mockjs`
  - `lodash` if still unused
  - `md5` if auth cleanup removes it
- Clean dead imports in `prisma/seed.ts`.

5. Add starter-quality tests and docs
- Add `vitest` + `supertest` baseline coverage.
- Cover health, auth, and one user read flow.
- Refresh README with setup, env, scripts, Prisma usage, and endpoint summary.

6. Optional schema polish
- Consider renaming Prisma model `user` to `User` while preserving table mapping via `@@map("user")`.
- Consider renaming `createAt/updateAt` to `createdAt/updatedAt` in Prisma and app code for consistency.
- Do this only if it does not create unnecessary migration churn for the current stage.

### Validation

- Routes reflect their actual purpose and input shape
- No request body validation remains on `GET /users`
- Unused dependencies are removed from lockfile and package manifest
- Tests cover the starter's real public contract
- README matches actual setup and scripts

### Test Expectation

- Login request validation test
- Login success/failure tests
- Authenticated `me` route test
- User list route test
- Prisma seed path sanity check

---

## Recommended Execution Order

1. Complete Phase 1 fully before touching auth semantics
2. Complete Phase 2 before redesigning the user/auth endpoints
3. Use Phase 3 to make the template externally coherent and lighter

---

## Key Decisions

- Keep Prisma on `6.19.x` for now because it is already working and remains the safer line if MongoDB is still a future possibility.
- Prefer Express 5 now instead of stabilizing on Express 4, because the repo is small and current official/community starter direction has already moved.
- Prefer JWT for API authentication while keeping `express-session` scoped to the graphic captcha flow.
- Keep the project intentionally small; modernization should not turn it into a heavyweight framework.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Express 5 migration changes middleware behavior unexpectedly | Keep Phase 1 small, validate route and middleware behavior immediately after the version move |
| Config migration breaks local startup | Add typed env validation and provide a clear `.env.example` or README env section |
| Auth cleanup causes regressions in the only existing user route | Rewrite route semantics and tests together in Phase 3 |
| Optional Prisma naming cleanup creates unnecessary churn | Treat naming polish as optional and defer if migration cost outweighs clarity gain |

---

## Success Criteria

- The repo starts, type-checks, builds, and validates Prisma cleanly
- Runtime/tooling versions reflect current maintained Express + TypeScript conventions
- Configuration and auth behavior are internally coherent
- Public endpoints match their validation and business purpose
- Dead dependencies are removed
- The repo is small, modern, and ready for continued feature work
