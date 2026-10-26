# ADR 003: Date-derived work order bars and action events

Date: 2026-10-25. Status: accepted for Task 2.

Order start and end dates are inclusive calendar days, confirmed by the user. Convert
the end to the next day boundary for rendering against half-open grid columns.
A pure function returns clipped start/width in column units, interpolating actual
month lengths and using UTC only as a neutral representation of date-only values.
Invalid calendar strings throw; reversed or invisible spans render no bar. This is
rendering behavior, not create/edit validation. Future overlap rules must use the
same inclusive endpoint convention and exclude the edited order.

The grid receives readonly orders and centers, groups orders per row, and uses a
single spanning cell for each row's positioning area. Existing table headers and
sticky center labels retain their shared geometry. Bars sit above the today marker
and below the sticky sidebar. No sample data or service mutations are introduced.

A reusable OnPush WorkOrderBar owns name/status presentation and its menu. Reuse the
already installed Angular CDK menu/overlay for keyboard navigation, Escape, focus
return, outside-click handling, and positioning outside the scrolling container.
No dependency installation is needed. Typed `{type, orderId}` outputs pass through
the grid, ready for future App integration; Edit/Delete currently have no data effect.

Preserve exact durations for short bars, with documented compact-content adaptations
in `docs/design/work-order-bars.md`. No panels, persistence, deletion, or overlap checks.
