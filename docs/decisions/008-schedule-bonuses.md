# ADR 008: Local persistence and incremental timeline navigation

Date: 2026-10-27. Status: accepted.

Keep WorkOrderDataService as the sole owner of order state. Load a versioned snapshot
from localStorage at startup. Validate document shape, IDs, centers, statuses, calendar
dates, and overlap with pure domain functions. Reject a corrupt snapshot as a whole
and show samples plus an accessible warning; do not silently drop individual orders.
Persist synchronously after successful mutations, including deletions and an empty
schedule. Storage failures retain usable in-memory state and show a warning. There is
no backend or cross-tab synchronization; concurrent tabs use last-write-wins storage.

Extend columns in batches of 14 days, 8 weeks, or 6 months when scrolling within two
columns of either edge. Pure date generation preserves calendar boundaries. The grid
compensates scrollLeft by the prepended column width after rendering; native scroll
anchoring is disabled to avoid double compensation. Center only on initial render,
zoom change, or Today. Zoom resets the loaded range but preserves orders.

Retain standalone OnPush components, Signals and stable document/date tracking.
No virtualization or new dependency is justified for this sample; very long exploration
can accumulate DOM columns. Reload or change zoom to reset the loaded range.

Keep native title tooltips and the existing accessible menu/dialog controls. Add an
180ms exit animation and hover-shadow transition with reduced-motion opt-out. During
exit, prevent duplicate submission and keep the native modal active until completion.
Calendar popup and Today styling reuse existing measured palette/control values.
Unprovided Sketch states remain adaptations, not pixel-perfect claims.
