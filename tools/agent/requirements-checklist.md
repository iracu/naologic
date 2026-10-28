# Requirements checklist

Source: `docs/requirements/FE-technical-test-10-2026.md`. Checked means implemented,
not merely installed or planned. Visual certification and submission tasks remain pending.

## Updating status

Check an item only after its implemented behavior or artifact has been verified. For
items changed in a task, cite the supporting file/test/manual result in the handoff
under this checklist heading. Leave partial items unchecked and describe what remains.
The scope of a completed task is distinct from completion of the whole assessment.

## Foundation

- [x] npm workspaces with standalone Angular 22, strict TypeScript/templates, SCSS.
- [x] Required ng-select and ng-bootstrap packages installed and integrated.
- [x] Plain TypeScript document contracts and local in-memory data service.
- [x] Five manufacturing work centers, eight orders, all four statuses, varied spans,
      multiple separated orders per center. Fixtures follow the required envelopes.
- [x] README, working agreement, persona, review checklist, ADR, AI prompt record.
- [x] Unit tests and focused Playwright interaction scenarios.

## Timeline and bars

- [x] Day default plus Week/Month zoom; same data and scale-appropriate headers.
- [x] Fixed work-center column and horizontally scrolling timeline.
- [x] Today indicator, initial range centered on today, appropriate buffers per zoom.
- [x] Measured row hover state and usable narrow-screen layout.
- [x] Date-derived bar positions, order names, four status badges, three-dot menus.
- [x] Edit and Delete actions; deletion updates displayed orders.

Feature paths below are relative to `apps/web/src/app/features/work-order-schedule`;
`app.spec.ts` remains at the application root.

Task 1 evidence: `domain/timeline.spec.ts`, `work-order-schedule.spec.ts`,
`app.spec.ts`; browser checks at 1280px and 390px confirm centered today, working
zoom, fixed sidebar under keyboard scroll, matching hover colors, and no page overflow.
Measurements and visual limitations: `docs/design/timeline-grid.md`.

Task 2 evidence: `domain/work-order-position.spec.ts`, `components/work-order-bar/work-order-bar.spec.ts`,
`app.spec.ts`, and zoom integration tests. Browser checked Day/Week/Month rendering,
keyboard menu opening/navigation and Escape focus return. End dates are inclusive.
Task 2 originally emitted action events only; Tasks 4/5 connect Edit/Delete. Compact bars and unprovided visual states are documented
in `docs/design/work-order-bars.md`; CRUD integration is now verified below.

## Create/edit panel

- [x] Empty-grid click selects the center and date; end date defaults to start + 7 days.
- [x] Right slide-out panel, measured width, “Work Order Details” heading.
- [x] Typed Reactive Forms: required name, ng-select status, ngb-datepicker dates.
- [x] Create defaults status to Open; Edit pre-populates existing data.
- [x] Create/Save labels and successful updates close the panel.
- [x] Outside click and Cancel close without saving; reset between sessions.
- [x] End strictly after start; same-center overlap blocks save with useful error.
- [x] Edit excludes itself from overlap checks; different centers do not conflict.

Task 3 evidence: `domain/work-order-rules.spec.ts`, `data-access/work-order-data.service.spec.ts`,
`components/work-order-panel/work-order-panel.spec.ts`. Creation defaults to Open, adds
through the service, updates the timeline, and closes. Task 4 now completes the shared Create/Edit items. Native focus/modal behavior and mobile layout were checked
in the browser; visual limitations are in `docs/design/work-order-panel.md`.

Task 4 evidence: shared rule, data-service, and panel specs cover self-exclusion,
conflict rejection, unchanged IDs, pre-population, menu-to-save integration, and
cancellation. Browser checks confirm Save updates the existing bar and restores focus
to the menu trigger. Task 5 now connects Delete to the data service.

Task 5 evidence: `apps/e2e/tests/schedule.spec.ts` covers Create/Edit/Delete, overlap
rejection, cancellation/reset, all zooms, fixed sidebar, row hover, narrow layout,
and keyboard focus. Service/parent unit tests cover immutable deletion and menu wiring.
Off-range edit focus loss was found and fixed. Scope excludes cross-browser pixel
certification, persistence bonuses, and submission artifacts.

## Design and accessibility

- [ ] Inspect Sketch and record exact colors, spacing, dimensions, and states.
- [ ] Load supplied Circular Std stylesheet and match measured typography.
- [ ] Match badges, panel, inputs, hover states, and today indicator.
- [ ] Semantic controls, labels, visible focus, associated errors, focus handling.

## Delivery

- [ ] Working complete application and responsive/manual review.
- [ ] Comments explain nontrivial date calculations and decisions.
- [ ] 5–10 minute Loom: zoom, create, edit, delete, overlap error, code walkthrough.
- [ ] Public GitHub/GitLab repository and clean history (publication/commits require request).

## Optional after core completion

- [x] localStorage, panel entry/exit and hover motion; basic Tab/Escape and focus restoration.
- [x] Infinite scroll, Today button, native full-description bar tooltips.
- [x] Expanded unit and Playwright behavior coverage.
- [ ] Pixel-diff visual comparisons.
- [x] Datepicker palette and focus styling; OnPush and stable tracking reviewed.
- [ ] Exact open-calendar visual comparison (no supplied Sketch state); large-range performance profiling.

Bonus evidence: versioned storage validation/service tests, extended calendar range tests,
and Playwright persistence/navigation scenarios. See ADR 008 for limits and adaptations.
