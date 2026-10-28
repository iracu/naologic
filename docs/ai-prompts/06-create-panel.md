# Task 3 — Create Panel

Date: 2026-10-26.

## User request

Use `tools/agent/frontend-engineer.md` to implement Task 3 from the original assignment
using the existing feature-based architecture, timeline, models, and data service.

- Open a fixed-width, right-sliding Create Panel from an empty timeline click; derive
  the work center and start date from the click. Outside click and Cancel discard changes.
- Use typed Reactive Forms with required name, ng-select status defaulting to Open,
  and ngb-datepicker start/end dates. Default end to start+7 days; require end after start.
- Reject same-center overlaps with a clear error. Create through the local service,
  immediately update the timeline, and close on success.
- Place the component in `work-order-panel/`; keep date/business rules pure, use Signals
  where appropriate, reuse existing code, and add tests for defaults, validation,
  overlap, and successful creation. Follow measured Sketch styling and animations.
- Implement Create only. No Edit/Delete, dependencies, backend, database, commit, or push.
- Run build, unit tests, and formatting; report results and remaining issues.

## Implementation decisions

Read the full assignment and persona. Extract Sketch panel/control measurements from
the original download. Use the previously confirmed inclusive endpoint semantics.
Implement inverse timeline geometry, pure creation rules, immutable service creation,
and typed string-date forms behind an ng-bootstrap adapter. Native dialog manages
modality; record unprovided animation/popup/mobile/error states as adaptations.

The initial tests exposed jsdom's missing dialog APIs. Added test-only method stubs;
real browser checks cover the native modal behavior. No runtime fallback hides errors.
See ADR 005 and `docs/design/work-order-panel.md` for details.
