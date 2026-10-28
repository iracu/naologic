# ADR 006: Shared Create/Edit panel

Date: 2026-10-26. Status: accepted.

Use a discriminated `WorkOrderPanelContext` union: create carries the clicked center/date;
edit carries the selected readonly order. A single schedule signal selects the mode.
Edit menu events resolve the current document from service-backed state; Delete events
remain unhandled. The existing panel resets the same typed form from either create
defaults or order data, clears validation messages, and selects Create/Save button text.
No new component, styles, dependencies, or duplicate form.

Rename the pure creation-rules module to `work-order-rules.ts` and its validator to
`validateWorkOrder`. Both create and update share required/date/overlap rules. An optional
excluded ID skips only the edited document; inclusive endpoint conflicts with other
same-center documents still fail. Create never supplies an exclusion.

WorkOrderDataService.update resolves the existing document, validates changes against
current state, and immutably replaces only that document. Preserve its ID, type, and
work center. Unknown IDs return an error, never insert a new document. Invalid edits
and cancellation leave state unchanged. Success closes the existing dialog and signals
immediately update the grid. Native dialog dismissal behavior is unchanged.

Validation covers pre-population, actual Edit menu wiring, saving an unchanged range,
changed names/status/dates, stable IDs and counts, invalid ranges, overlap self-exclusion,
other-order conflicts, missing IDs, all dismissal paths, and resetting Create defaults.
Browser checks confirm save, overlap rejection, and focus return to the bar trigger.
Existing design limitations remain; no new pixel-perfect or cross-browser claims.
