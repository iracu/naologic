# ADR 001: Lightweight Angular workspace foundation

Date: 2026-10-25. Status: accepted for the foundation.

## Decision

Use two private npm workspaces and a single root lockfile. Angular CLI configuration
lives in apps/web; Playwright configuration lives in apps/e2e. No Nx/Turborepo,
shared library packaging, router, SSR, backend, or persistence is needed for this scope.

Use the already-installed Node 22.23.2 and npm 10.9.8. Pin direct dependency versions.
Angular framework 22.2.3 and CLI/build 22.2.4 are compatible patches of the same
major/minor line. TypeScript 6.0.3 satisfies the builder peer range. Angular 22 is
supported and has compatible releases of the mandatory controls.

Use ng-bootstrap 21.0.0 with Bootstrap 5.3.8, Popper 2.11.8 and Angular localize;
ng-select 24.2.1 has Angular 22 and CDK 22 peers. Install these now but integrate UI
styles only after design inspection. Use Angular's default zoneless bootstrap and OnPush.

The first Angular 21 install exposed undici advisories through its builder. npm audit
identified the Angular 22 builder as the available fix. With no feature migration cost,
we updated the full compatible stack rather than using force or transitive overrides.
Node 22.23.2 meets Angular 22's minimum of 22.22.3.

Use CLI's Vitest runner with jsdom for initial tests, and Playwright Chromium config
for later behavior tests. No E2E scenarios or browser downloads in the foundation.
Prettier provides a small consistent formatting tool; strict compilation supplies
initial static checks. Add linting later if concrete rules justify the setup.

## Boundaries

Plain readonly TypeScript document types live in domain. Pure fixture generation
lives in data-access with no Angular dependency; an Angular service supplies today's
local calendar date and exposes readonly in-memory state. Eight hardcoded relative
spans keep sample data relevant as the assessment ages. Tests inject fixed anchors.
UTC calendar arithmetic inside the fixture factory avoids DST offset drift.

CRUD, overlap rules, timeline geometry, and form adapters are deferred. Before those
features, decide whether end dates are inclusive or exclusive; the assignment does
not settle same-day endpoint overlap. Fixture gaps work under either interpretation.
No date library is needed for this small fixture helper; reassess during date math work.

## Consequences and evidence

A fresh checkout uses nvm use then npm ci at the root. Node 18 intentionally fails
engine checks. This directory initially had no Git metadata; no commit or remote was
created. Preserve the assignment and existing local IDE configuration.

- https://angular.dev/reference/versions
- https://angular.dev/reference/releases
- https://github.com/ng-bootstrap/ng-bootstrap#dependencies
- https://github.com/ng-select/ng-select#versions
- npm registry peerDependencies checked before installing; npm install resolves without overrides.

Design measurements and endpoint semantics remain open for the next feature slice.

Angular 22.2 still has a Vite development-tooling advisory. The audit-suggested
22.1 downgrade was evaluated but introduced additional critical/high advisories,
so it was rejected. Final choice: 22.2.3 framework / 22.2.4 CLI/build, compatible
transitive updates, no overrides. Report the residual audit status explicitly and
revisit when a patched Angular builder is published.
