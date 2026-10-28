# Task 4 — Edit Panel

Date: 2026-10-26.

## User request

Use `tools/agent/frontend-engineer.md` to implement Task 4 from the original assignment,
following the feature architecture and reusing Create Panel.

- Open the existing Work Order Panel from Edit in a bar's menu; no separate component.
- Retain “Work Order Details”, pre-populate all fields, show Save, and preserve dismissal.
- Reuse typed form validation; end must follow start. Reuse overlap detection excluding
  the edited order, display conflicts, and prevent invalid saves.
- Update through WorkOrderDataService, preserving docId; update the timeline immediately
  and close on success. Cancel must not modify the original.
- Support create/edit modes using existing Signals patterns. Avoid duplicated forms,
  validation, or date utilities. Preserve Create functionality and styling.
- Test editing, pre-population, overlap, unchanged IDs, and cancellation.
- Edit only; no Delete or unrelated features. Run build, unit tests, and formatting.
  No commit or push.

## Decisions

Use a discriminated panel context and one shared form. Generalize the existing domain
validator instead of copying it; optionally exclude only the edited document's ID.
Add immutable service update preserving the existing center and document envelope.
Keep Delete unhandled. Preserve all existing Create tests and add edit-specific tests.
See ADR 006. Existing uncommitted Task 3 work is preserved.
