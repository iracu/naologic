# Status dropdown fix

Date: 2026-10-27.

User reported that the status dropdown opened but would not select another option,
with a screenshot of the Create panel. Reproduced with a real Playwright option click:
the Start Date input intercepted the pointer. The installed ng-select renders through
a CDK overlay outside the native modal by default; visible options outside that modal
were inert. Set appendTo to the existing .work-order-panel so the overlay is hosted
within the dialog. No z-index workaround, style redesign, or dependency changes.

Added desktop and narrow-viewport browser regressions selecting all four statuses,
retaining the name, creating with Blocked, editing to Complete, and verifying status
after refresh. The regression failed before the fix and passed afterward.
