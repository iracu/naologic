# Task 1 — Timeline Grid

Date: 2026-10-25

## User prompt

Use the **`tools/agent/frontend-engineer.md`** agent persona to implement **Task 1 — Timeline Grid** from `docs/requirements/FE-technical-test-10-2026.md`.

Requirements:

- Implement the timeline layout with a fixed Work Center sidebar and horizontally scrollable grid.
- Support Day (default), Week, and Month zoom levels using `ng-select`.
- Display the appropriate date headers for each zoom level.
- Center the initial timeline view around today's date.
- Add a vertical current-day indicator.
- Highlight work center rows on hover.
- Use existing work center sample data and follow the project's Angular architecture.
- Follow the Sketch design as closely as possible. Do not invent unavailable design measurements.

Keep components small, reusable, and maintainable. Use pure TypeScript functions for date calculations and add relevant unit tests.

**Scope:** Implement only the Timeline Grid. Do not implement work order bars, Create/Edit panels, or other features yet.

Run build and relevant tests, report the results, and suggest a Conventional Commit message.

Do not commit or push changes.

## Decisions

- Inspect the source artboard through Sketch's browser inspector and record measurements.
- Separate toolbar and grid presentation; retain the existing service and pure domain functions.
- Use Monday weeks, actual month lengths, and local today with UTC date-only arithmetic.
- Center today initially and on zoom changes; preserve scroll during ordinary interaction.
- Reuse measured column spacing across scales and explicitly document unmeasured design states.
- Keep all work-order interactions outside this slice. No dependencies, commits, or pushes added.
