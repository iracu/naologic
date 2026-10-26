# Requirements checklist

Source: `docs/requirements/FE-technical-test-10-2026.md`. Checked means implemented,
not merely installed or planned. Panel, mutation, validation, and submission tasks remain pending.

## Updating status

Check an item only after its implemented behavior or artifact has been verified. For
items changed in a task, cite the supporting file/test/manual result in the handoff
under this checklist heading. Leave partial items unchecked and describe what remains.
The scope of a completed task is distinct from completion of the whole assessment.

## Foundation

- [x] npm workspaces with standalone Angular 22, strict TypeScript/templates, SCSS.
- [x] Required ng-select and ng-bootstrap packages installed; control integration pending.
- [x] Plain TypeScript document contracts and local in-memory data service.
- [x] Five manufacturing work centers, eight orders, all four statuses, varied spans,
      multiple separated orders per center. Fixtures follow the required envelopes.
- [x] README, working agreement, persona, review checklist, ADR, AI prompt record.
- [x] Initial unit tests and Playwright configuration (no browser scenarios yet).

## Timeline and bars

- [x] Day default plus Week/Month zoom; same data and scale-appropriate headers.
- [x] Fixed work-center column and horizontally scrolling timeline.
- [x] Today indicator, initial range centered on today, appropriate buffers per zoom.
- [x] Measured row hover state and usable narrow-screen layout.
- [x] Date-derived bar positions, order names, four status badges, three-dot menus.
- [ ] Edit and Delete actions; deletion updates displayed orders.

Feature paths below are relative to `apps/web/src/app/features/work-order-schedule`;
`app.spec.ts` remains at the application root.

Task 1 evidence: `domain/timeline.spec.ts`, `work-order-schedule.spec.ts`,
`app.spec.ts`; browser checks at 1280px and 390px confirm centered today, working
zoom, fixed sidebar under keyboard scroll, matching hover colors, and no page overflow.
Measurements and visual limitations: `docs/design/timeline-grid.md`.

Task 2 evidence: `domain/work-order-position.spec.ts`, `components/work-order-bar/work-order-bar.spec.ts`,
`app.spec.ts`, and zoom integration tests. Browser checked Day/Week/Month rendering,
keyboard menu opening/navigation and Escape focus return. End dates are inclusive.
Edit/Delete emit events only. Compact bars and unprovided visual states are documented
in `docs/design/work-order-bars.md`; CRUD integration remains unchecked.

## Create/edit panel

- [ ] Empty-grid click selects the center and date; end date defaults to start + 7 days.
- [ ] Right slide-out panel, measured width, “Work Order Details” heading.
- [ ] Typed Reactive Forms: required name, ng-select status, ngb-datepicker dates.
- [ ] Create defaults status to Open; Edit pre-populates existing data.
- [ ] Create/Save labels and successful updates close the panel.
- [ ] Outside click and Cancel close without saving; reset between sessions.
- [ ] End strictly after start; same-center overlap blocks save with useful error.
- [ ] Edit excludes itself from overlap checks; different centers do not conflict.

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

- [ ] localStorage; animations; enhanced keyboard navigation.
- [ ] Infinite scroll; Today button; bar tooltips.
- [ ] Expanded unit and Playwright behavior coverage; visual comparisons.
- [ ] Custom datepicker styling and performance review.
