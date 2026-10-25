# Requirements checklist

Source: `docs/requirements/FE-technical-test-10-2026.md`. Checked means implemented,
not merely installed or planned. UI and submission tasks are intentionally pending.

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

- [ ] Day default plus Week/Month zoom; same data and scale-appropriate headers.
- [ ] Fixed work-center column and horizontally scrolling timeline.
- [ ] Today indicator, initial range centered on today, appropriate buffers per zoom.
- [ ] Measured row hover state and usable narrow-screen layout.
- [ ] Date-derived bar positions, order names, four status badges, three-dot menus.
- [ ] Edit and Delete actions; deletion updates displayed orders.

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
