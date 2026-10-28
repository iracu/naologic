# Browser scenarios

Run `npm run e2e:install` once to install Chromium for the pinned Playwright version,
then `npm run e2e` from the repository root. `npm run e2e:list` only lists scenarios.

The suite starts its own app server on 127.0.0.1:4202 and never reuses the developer's
4200 server. Keep 4202 free. Each test gets a fresh browser context and in-memory data.
A fixed date (2026-10-26) and UTC timezone keep sample orders and date expectations
stable without changing application code.

Coverage: Create/Edit/Delete, validation and inclusive overlap rejection, self-exclusion,
dismissal/reset, date clicks in all zooms, order retention through zoom, fixed sidebar
under horizontal wheel scrolling, row hover, mobile layout, and keyboard focus return.
Assertions use visible UI and DOM geometry, not private Angular state. No snapshots or
visual pixel comparisons. Chromium only; other browser engines are not certified.

Failure traces and the HTML report are ignored artifacts under test-results and
playwright-report. Playwright retries twice on CI and does not retry locally.

Bonus coverage includes CRUD across refreshes, corrupt storage recovery, incremental
scrolling in all zooms, preserved prepend anchors, Today centering, Tab and tooltip content.
Browser contexts isolate localStorage between tests; reloads within a test retain it.

## Organization

- `timeline.spec.ts`: date clicks, fixed sidebar, hover, infinite scroll, Today.
- `work-orders.spec.ts`: Create/Edit/Delete, zoom retention, status selection.
- `validation.spec.ts`: required fields, invalid calendar dates, date ordering,
  inclusive overlap boundaries, different centers, edit self-exclusion and stable IDs.
- `accessibility.spec.ts`: dismissal, focus return, keyboard navigation, mobile and touch menus.
- `persistence.spec.ts`: CRUD across reloads and corrupt storage recovery.
- `visual-states.spec.ts`: existing measured geometry and hover regressions.
- `support/schedule.ts`: explicit per-test setup and shared interaction helpers.

Month is the requested default (superseding the original assignment's Day default).
Setup verifies Month before explicitly selecting Day for date-based interactions.
Native dialog keyboard checks allow browser chrome focus at the tab boundary, while
rejecting focus on background application controls. These are focused interaction
checks, not an accessibility audit or a pixel-perfect design certification.

Run `npm run typecheck:e2e`, `npm run e2e:list`, and `npm run e2e` from the root.
To target a file: `npm run test --workspace=@naologic/e2e -- tests/validation.spec.ts`.
