# ADR 005: Create-only panel and guarded in-memory mutation

Date: 2026-10-26. Status: accepted.

The schedule container stores optional creation context in a signal. The grid emits
center ID and calendar date from an empty-row click. Compute pointer position from the
row's current bounding rectangle, which already includes horizontal scroll displacement.
A pure inverse-geometry function converts column fractions into real calendar days at
Day/Week/Month zoom. Bars remain siblings above the empty-area button, so their events
do not initiate creation. Keyboard activation starts from today and announces that date.

A standalone WorkOrderPanel uses typed FormGroup/FormControl/Validators and a UI-local
NgbDateAdapter to keep calendar strings in the form while ng-bootstrap handles calendar
structs. The new instance resets to Open, an empty name, the selected start, and start+7
calendar days. Subsequent start-date edits do not silently overwrite an edited end date.
Pure domain functions own defaults, strict date-range validation, and inclusive overlap.
Sharing an endpoint on the same work center conflicts; different centers are independent.

WorkOrderDataService.create validates against its current readonly state and center IDs,
then appends a fresh document immutably using crypto.randomUUID. It trims the name and
returns a validation message on failure. Invalid submissions leave state untouched;
success updates the grid's computed orders and closes the panel. No edit exclusion or
edit/delete mutation is implemented in this create-only task.

A native modal dialog provides top-layer rendering, background inertness, and focus
containment. Initial focus goes to the name; closing returns to the timeline scroll
region. Cancel, Escape, and clicks outside dismiss without writing. The ng-select and
calendar dropdowns remain inside the dialog. No extra dependency or shared abstraction.

Tests cover calendar defaults and click geometry, overlap boundaries, data integrity,
form errors, cancellation/reset, and the pointer-to-creation integration. jsdom lacks
showModal/close, so only those methods are stubbed in tests; browser checks verify actual
modal focus behavior. Visual adaptations are recorded in the panel design evidence.
