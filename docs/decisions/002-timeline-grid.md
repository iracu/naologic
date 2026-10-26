# ADR 002: Calendar grid and local presentation

Date: 2026-10-25. Status: accepted for Task 1.

Use App to compose a small timescale toolbar and timeline grid. The existing data
service remains the owner of sample data; the grid receives readonly work centers
and columns. No work-order bars, CRUD, panels, persistence, or new packages.

Pure TypeScript creates contiguous calendar intervals: 29 days (today ±14), 19
Monday-based weeks (current week ±9, about two months each way), and 13 months
(current month ±6). Date-only values use UTC calendar arithmetic, while the UI's
initial today is captured from the user's local calendar. Months have their real
length. Weeks start Monday as an explicit convention, not a requirement inferred
from Sketch. Grid intervals are half-open; order-overlap endpoint rules remain open.

A semantic table shares row geometry across a sticky first column and scrolling
date columns, avoiding separate scrolling elements and hover synchronization.
A focusable, named scroll region supports keyboard scrolling. One indicator overlays
the data area without intercepting input or covering the sticky sidebar.

The grid measures rendered columns after Angular renders and centers today's day
midpoint in the area to the right of the sidebar on initial render and zoom changes.
Today is captured at page load; automatic rollover while a tab stays open overnight
is deferred. Resizing preserves the user's scroll position rather than recentering.

Reuse measured Month geometry for Day/Week; document unmeasured states and responsive
adaptations in docs/design/timeline-grid.md. Use ng-select's supplied default theme
for mechanics until its full design states are measured. No guessed custom tokens.
