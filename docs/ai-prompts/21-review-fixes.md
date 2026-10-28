# Implement review findings

User request: implement the needed changes from the comprehensive code review.

- Preserve date-based widths; compact bars retain a visible action affordance and
  the action menu provides full name, status, start date, and end date. This is an
  explicit accessibility adaptation, not a newly measured Sketch state. Reuse
  existing menu typography, spacing, and color tokens.
- Make the current calendar date a signal refreshed at local midnight and when
  the document becomes visible. Clean up the timer and listener on destruction.
  Stored orders and an already-open form are not rewritten at midnight.
- Map Sketch Regular/Book/Medium to official CSS weights 400/500/600. Preserve
  the Regular sidebar and badge typography while correcting measured Book and
  Medium roles.
- Format the existing date adapter without changing behavior.
- Add regression coverage for midnight, suspended-tab recovery, cleanup, compact
  pointer/keyboard details, and touch access.
