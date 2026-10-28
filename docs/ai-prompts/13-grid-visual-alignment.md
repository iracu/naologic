# Align the schedule canvas with the design

Date: 2026-10-27.

User supplied design/application screenshots and pointed out the difference. Compared
the matching Sketch layer geometry rather than treating screenshot zoom as CSS scale.
Extended the canvas/sidebar/vertical lines to the viewport bottom; restored the first
row's measured60px, toolbar spacing and sidebar-only horizontal separators. Added the
measured current-period badge and empty-area hover preview/hint. Kept Day default,
Today bonus, saved data and exact click-to-create date mapping.

Evidence and adaptations: docs/design/timeline-grid.md. Added a browser regression for
desktop/mobile canvas extent, text weight, overflow, hover and click-through behavior.

Verification: production build and60 unit tests passed. The new hover scenario initially
ran during the pending resize/Today scroll event, which correctly clears stale previews;
it now synchronizes with rendering before moving the pointer. The focused regression
then passed. Browser inspection confirmed the extended canvas and current-month badge.
Visual comparison is limited by different sample durations and unavailable pixel baselines.
