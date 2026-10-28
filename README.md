# Work Order Schedule Timeline

Naologic frontend assessment with a Day/Week/Month timeline grid, fixed Work Center
sidebar, today's indicator, horizontal scrolling, row hover, and date-derived work
order bars. Bars show status and accessible Edit/Delete menus; Edit opens the shared panel.
The shared Create/Edit Panel uses typed forms, calendar defaults, and same-center overlap
validation with edit self-exclusion. Delete removes the selected order through the in-memory service. The original assignment is in [docs/requirements](docs/requirements/FE-technical-test-10-2026.md).

## Setup

Use Node **22.23.2** (minimum 22.22.3 within Node 22) and npm **10.x**; verified with
npm 10.9.8. Node 18 is not supported. With nvm installed:

```sh
nvm use
npm ci
npm start
```

If that Node version is not installed, run `nvm install` first. Run installation at the
repository root: one lockfile covers both workspaces. Open http://localhost:4200.
No backend, environment variables, credentials, global Angular CLI, or browser download
is needed for the application or unit tests.

`npm start` delegates to `ng serve` in apps/web. The equivalent direct command is:

```sh
cd apps/web
npm exec -- ng serve
```

## Development commands

Run these from the root:

| Command                 | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `npm start`             | Angular development server                           |
| `npm run build`         | Production build into apps/web/dist/web              |
| `npm test`              | Angular/Vitest unit tests, one run                   |
| `npm run test:watch`    | Unit tests in watch mode                             |
| `npm run typecheck:e2e` | Strict TypeScript check of Playwright configuration  |
| `npm run e2e:list`      | List the browser interaction scenarios               |
| `npm run e2e:install`   | Install the matching Chromium browser once           |
| `npm run e2e`           | Run Chromium interaction scenarios                   |
| `npm run format:check`  | Check formatting, excluding the untouched assignment |
| `npm run format`        | Format authored files                                |
| `npm audit`             | Inspect dependency advisories                        |

Playwright starts an isolated app server on port 4202 (keep it free). Run
`npm run e2e:install` once before `npm run e2e`. Failure traces and HTML reports go
to apps/e2e/test-results and apps/e2e/playwright-report. Tests use a fixed date and
fresh in-memory state; they do not affect a developer session on port 4200.

## Layout

```text
.
├── AGENTS.md
├── README.md
├── package.json / package-lock.json
├── .nvmrc / .npmrc / .editorconfig / .prettierrc.json
├── apps
│   ├── web
│   │   ├── angular.json / package.json / tsconfig*.json
│   │   └── src
│   │       ├── main.ts / index.html / styles.scss
│   │       └── app
│   │           ├── app.ts / app.html / app.scss / app.config.ts / app.spec.ts
│   │           └── features/work-order-schedule
│   │               ├── work-order-schedule.ts / .html / .scss / .spec.ts
│   │               ├── components
│   │               │   ├── timeline-grid/ (TS, HTML, SCSS)
│   │               │   ├── timeline-toolbar/ (TS, HTML, SCSS)
│   │               │   ├── work-order-bar/ (TS, HTML, SCSS, spec)
│   │               │   └── work-order-panel/ (TS, HTML, SCSS, spec, date adapter)
│   │               ├── domain/ (models, pure date functions, specs)
│   │               └── data-access/ (sample data, service, specs)
│   └── e2e
│       ├── package.json / playwright.config.ts / tsconfig.json
│       └── tests/README.md
├── tools/agent
│   ├── frontend-engineer.md
│   ├── requirements-checklist.md
│   └── review-checklist.md
└── docs
    ├── requirements/FE-technical-test-10-2026.md
    ├── design/README.md
    ├── ai-prompts/01-project-foundation.md
    └── decisions/001-project-foundation.md
```

## Approach and dependencies

| Dependency         | Version         | Reason                                                         |
| ------------------ | --------------- | -------------------------------------------------------------- |
| Angular framework  | 22.2.3          | Standalone, zoneless application and typed Reactive Forms      |
| Angular CLI/build  | 22.2.4          | Standard dev server, production bundling, unit-test runner     |
| TypeScript         | 6.0.3           | Supported Angular compiler range; strict application/templates |
| ng-bootstrap       | 21.0.0          | Required ngb-datepicker for the future form                    |
| ng-select          | 24.2.1          | Required select controls                                       |
| Angular CDK        | 22.2.3          | ng-select peer dependency for overlays                         |
| Bootstrap / Popper | 5.3.8 / 2.11.8  | ng-bootstrap CSS compatibility and positioning peer            |
| Angular localize   | 22.2.3          | ng-bootstrap peer and localization initialization              |
| RxJS / tslib       | 7.8.2 / 2.8.1   | Angular ecosystem primitives and TypeScript runtime helpers    |
| Vitest / jsdom     | 4.1.12 / 28.0.0 | CLI-integrated unit tests and DOM environment                  |
| Playwright         | 1.64.1          | Browser-test configuration for future interaction coverage     |
| @types/node        | 22.19.15        | Node types for Playwright configuration                        |
| Prettier           | 3.8.1           | Consistent source and documentation formatting                 |

Direct versions are pinned; the lockfile pins transitive dependencies. Angular and
mandatory library peer requirements were checked before installing. See
[ADR 001](docs/decisions/001-project-foundation.md) for compatibility sources and the
reason the initial Angular 21 candidate was replaced after its audit.

The root App renders the standalone WorkOrderSchedule feature container. Each child
component keeps its companion files together. The feature owns domain and data-access
code; no cross-feature core/shared layer is needed. See [ADR 004](docs/decisions/004-feature-organization.md).

Domain types are framework-independent. The local data service exposes readonly signal
state built from five centers and eight orders with all four statuses. The fixture
factory accepts an explicit calendar date and uses UTC calendar arithmetic to avoid
DST shifts; the service anchors fixtures to the user's local day. Components
consume state and delegate scheduling rules to plain functions. Versioned localStorage persists validated orders through refreshes. Storage errors retain
usable in-memory state with a warning. No backend or global state library is used.

## Verification and remaining work

Verified on Node 22.23.2 / npm 10.9.8. Install, peer and audit results below are from
the foundation; build, tests, formatting, and E2E configuration checks were rerun for the optional schedule bonuses:

| Check                        | Result                                                             |
| ---------------------------- | ------------------------------------------------------------------ |
| `npm install`, then `npm ci` | Successful workspace resolution and clean lockfile install         |
| `npm run build`              | Production build passes                                            |
| `npm test`                   | 60 tests pass across 10 files                                      |
| `npm run typecheck:e2e`      | Passes                                                             |
| `npm run e2e`                | 17 Chromium interaction tests pass                                 |
| `npm run e2e:list`           | 17 Chromium scenarios discovered                                   |
| `npm run format:check`       | Passes                                                             |
| `npm ls --all`               | No invalid/missing peer dependencies                               |
| `npm audit`                  | 2 findings remain: 1 high Vite issue entry and 1 low builder entry |

Tests cover sample-data integrity, calendar ranges, leap days, week/month boundaries,
scroll clamping, today positioning, and ng-select zoom integration. Manual browser
checks cover Day/Week/Month, fixed sidebar during scrolling, hover colors, and a 390px
viewport without page overflow. Playwright covers the interaction flows, including narrow layouts and keyboard focus.

Audit limitation: Angular build 22.2.4 pins an affected Vite release. `npm audit fix`
updated undici compatibly but exits nonzero for the remaining Vite/build findings.
The suggested builder downgrade was tested and rejected because it introduced more
advisories. No force or overrides were used. These are development-tooling findings;
keep the development server local and revisit the builder when a patched compatible
release is available. This foundation does not have a clean full dependency audit.

See [grid measurements](docs/design/timeline-grid.md) and [ADR 002](docs/decisions/002-timeline-grid.md)
for measured values, responsive adaptations, Monday weeks, and date geometry.
Exact dropdown styling and automatic midnight rollover are not implemented.
Bars and menu UI are implemented with inclusive end dates; see
[bar measurements](docs/design/work-order-bars.md) and [ADR 003](docs/decisions/003-work-order-bars.md).
Create is implemented; see [ADR 005](docs/decisions/005-create-panel.md) and
[panel measurements](docs/design/work-order-panel.md). Edit is implemented using the same panel; see [ADR 006](docs/decisions/006-edit-panel.md).
Delete is implemented. See [ADR 007](docs/decisions/007-interaction-verification.md)
and [browser scenarios](apps/e2e/tests/README.md). Visual polish and submission work
remain separate from interaction verification.

The directory initially contained no Git repository. No commits or remote publication
were created. A public repository and Loom demo remain final submission tasks.

## Optional features

Orders persist under localStorage key `naologic.work-orders.v1`. Invalid snapshots fall
back to samples with a warning; successful mutations replace the snapshot. To reset the
demo, remove that key in browser storage and reload. Empty schedules are preserved.
There is no cross-tab synchronization (last write wins).

Scroll toward either boundary to load more dates; prepending preserves the visible
anchor. Today centers the current day; zoom changes reset the loaded date range.
Panel entry/exit and bar hover honor reduced motion. Hover titles contain full order
details. Existing calendar styling uses the measured palette; Sketch provides no open
calendar state for exact comparison. See [ADR 008](docs/decisions/008-schedule-bonuses.md).

Long exploration accumulates columns without virtualization. Other browser engines,
screen readers, and pixel-diff verification remain outside the executed coverage.
