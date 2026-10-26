# Task 2 — Work Order Bars

Date: 2026-10-25.

## User prompt

Use the **`tools/agent/frontend-engineer.md`** agent persona to implement **Task 2 — Work Order Bars** from `docs/requirements/FE-technical-test-10-2026.md`.

Requirements:

- Display work orders as horizontal bars within their corresponding work center rows.
- Each bar must include:
  - Work order name.
  - Status badge (Open, In Progress, Complete, Blocked).
  - Three-dot actions menu with Edit/Delete options.
- Apply status colors according to the requirements and Sketch design.
- Calculate bar positions and widths based on `startDate` and `endDate`.
- Ensure correct positioning across Day, Week, and Month zoom levels.
- Support multiple non-overlapping work orders on the same work center.
- Reuse existing domain models, sample data, and timeline calculations.
- Keep the implementation pixel-perfect according to the Sketch design.

Implementation guidelines:

- Create a reusable Work Order Bar component.
- Keep date calculations in pure TypeScript functions.
- Follow the existing Angular architecture and coding conventions.
- Add relevant unit tests for positioning, date boundaries, and zoom levels.
- Ensure the actions menu is keyboard-accessible.

**Scope:** Implement only Work Order Bars and the actions menu UI. Do not implement Create/Edit panels, deletion logic, or overlap validation yet. Leave Edit/Delete actions ready for integration with the next tasks.

Run the build and relevant tests, report the results, and suggest a Conventional Commit message.

Do not commit or push changes.

## Clarification and decisions

- User confirmed inclusive end dates: “Include the end date (Recommended)”.
- Read the complete original assignment and frontend persona before changes.
- Inspect downloaded Sketch layer data; record measurements and unavailable states.
- Pure date geometry clips ranges and interpolates actual month lengths.
- Reuse the existing CDK dependency for accessible menus and emit typed action events.
- Preserve sample data and existing Task 1 work; no panels, mutations, or overlap checks.
- Document compact bars and the Open palette adaptation rather than claim unverified
  pixel perfection. See ADR 003 and the bar design evidence.
