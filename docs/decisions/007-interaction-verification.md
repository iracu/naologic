# ADR 007: Complete interactions and browser regression coverage

Date: 2026-10-26. Status: accepted.

The existing Create/Edit, zoom, scroll, and hover implementations are retained. Connect
Delete to the existing parent action handler and add a minimal service delete method.
Remove exactly the selected ID immutably; unknown IDs leave state untouched. Keep the
work centers and other documents unchanged. No confirmation dialog or persistence layer.

Return focus to the named timeline region after deleting the menu trigger. E2E testing
also exposed a lost-focus case when an edit moves an order outside the rendered range:
the dialog's former return-focus target disappears. After panel dismissal and rendering,
restore focus to the timeline only if focus has fallen back to the document body.
Normal native focus return to an existing bar is preserved.

Run focused Playwright scenarios with isolated contexts, a fixed calendar date and UTC,
and a dedicated fresh server on port 4202. Do not accidentally test a stale developer
server. Use the existing pinned Playwright and its matching Chromium browser binary;
no package changes. Cover user-observable state, including creation on the right row,
editing without duplicates, deletion, overlap rejection, cancellation, zoom retention,
scroll/hover, mobile behavior, and keyboard focus. No Angular state inspection.

Initial failures: Chromium was not installed (resolved with the existing e2e:install
command); an End-key test incorrectly assumed horizontal scrolling (replaced with a
horizontal wheel gesture); an off-range edit lost keyboard focus (fixed as above).

Reopen the modal after rendering a new panel context, including when a rapid close/open
reuses the component before Angular removes it. A unit regression checks that the dialog
opens again, not just that its form resets. Browser tests also wait for the selected
zoom's headers before measuring click coordinates; otherwise Day geometry can be read
during a pending change to Week.
