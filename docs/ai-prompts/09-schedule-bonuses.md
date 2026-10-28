# Bonus Points implementation

Date: 2026-10-27.

## Request

Use tools/agent/frontend-engineer.md to implement missing Bonus Points from the assignment:
localStorage persistence with invalid-data handling; smooth panel and bar transitions;
keyboard access and focus management; infinite horizontal scrolling with prepend anchor
preservation; Today centering; full work-order tooltips. Extend deterministic Vitest
and Playwright coverage, polish datepicker/accessibility/responsiveness, retain OnPush
and stable tracking, and preserve existing functionality and architecture. Run production
build, unit tests, E2E and formatting; report results, limits, and Conventional Commit
suggestions. No commits or pushes, unnecessary dependencies, or abstractions.

## Decisions

Reviewed the current implementation first. Retained existing native title tooltips,
Tab/Escape handling, focus restoration, slide-in and measured-palette datepicker styles.
Added versioned storage with pure validation and warning feedback, batched date extension,
Today, exit motion, hover shadow, and explicit focus outlines. See ADR 008.

The first browser run passed nine scenarios and failed three assertions: two keyboard
actions ran during the new modal exit transition, and an unqualified status locator
also matched ng-select's live region. Tests now wait for dismissal and the persistence
message has an accessible name. No application failure was hidden by arbitrary delays.

## Verification and self-review

Passed: production build; 60 Vitest tests across 10 files; 14 Chromium E2E scenarios;
formatting; E2E typecheck/discovery; diff whitespace check. Regression coverage includes
existing CRUD/overlap/cancel flows, corrupt and unavailable storage, empty persisted
schedules, leap-day calendar extensions, all zooms, prepend anchoring, Today, keyboard
focus and mobile layout. Initial test failures are explained above.

Self-review passed scope, preservation of existing work, feature boundaries, pure
calendar/storage validation, immutable service state, readonly exposure, strict typing,
OnPush and stable tracking, inclusive dates, overlap exclusion, and existing form/menu
behavior. New motion and controls use documented design adaptations. No dependencies,
commits, pushes or publication. No actionable findings in reviewed scope.

Not verified: other browser engines, screen readers, exact pixel comparison, large-range
performance profiling, and a fresh dependency audit. Cross-tab synchronization and
virtualization are not implemented. Native tooltip appearance is browser-controlled;
Sketch has no open-calendar state for exact styling validation. These are limitations,
not claims of full visual certification.

A subsequent mobile geometry check observed 389.99997px during a transform for a
390px panel. The assertion now allows subpixel rounding (two decimal places) rather
than requiring exact floating-point equality. A final formatting check also flagged
one changed service expression; Prettier corrected it.
