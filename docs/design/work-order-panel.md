# Create Panel design evidence

Source: [FE Take-Home Challenge](https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667),
local original Sketch download, inspected 2026-10-26. Artboard:
**Work Order Schedule - Create New Event - Placeholder and Defaults**.
Measurements are from its layer JSON and referenced symbol masters.

| Element               | Source measurement                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| White panel Rectangle | x849, width591, height1024 in a 1440×1024 artboard                                                                   |
| Content               | x873 (24px inset), width543; first field y107                                                                        |
| Header                | title y16, 20px Circular Std Medium, 25px line box; subtitle y46, 16px Book, 20px line box                           |
| Divider               | y82, full panel width                                                                                                |
| Actions               | Cancel x1276, Create x1350; 66×32px, y25, gap8, right inset24                                                        |
| Button symbols        | radius7, 15px Book; primary fill/border #5659FF, white text; secondary white, #2F3059 text; shadow 0 1px 3px #C8CFE9 |
| Field groups          | y107,193,279,365; height62, gap24                                                                                    |
| Text field symbol     | label14px, height16, #687196; control starts24px below label top, height38, radius5, border1 #D8DCEB, fill white     |
| Input text            | 14px, #030929, inset8; placeholder override “Acme Inc.”                                                              |
| Input shadows         | 0 1px .5px -1px #D8DCEB; 0 1.5px 3px -1.5px #C8CFE9                                                                  |

The panel uses the measured desktop width capped at the viewport width. At widths
below591px header actions move below the description. Focus outlines, error text,
and calendar popup styling reuse existing measured palette values. Errors occupy
extra space rather than overlapping controls. The status dropdown retains the installed
ng-select theme mechanics with the measured control dimensions.

The Sketch file provides no measured animation duration, reduced-motion state, narrow
layout, validation-error state, or open calendar popup. A 180ms ease-out slide-in,
transparent modal backdrop, reduced-motion opt-out, and scoped ng-bootstrap calendar
styles are explicit implementation adaptations, not claimed design measurements.
No full Bootstrap stylesheet is loaded and no dependencies were added.

Manual browser verification covers the 591px desktop panel and 390px full-width layout,
initial focus, default dates, calendar popup, creation, overlap error, Cancel and Escape.
No automated pixel-diff baseline or cross-browser visual certification is claimed.

Bonus update (2026-10-27): exit uses the same 180ms motion adaptation as entry, with
reduced-motion opt-out. Calendar focus outlines reuse #5659FF. Today reuses the measured
32px button height, 7px radius, 8px inset and existing palette. Bar hover reuses the panel
shadow with a 180ms transition. No new Sketch measurement is claimed. The native browser
tooltip exposes the full order description; its appearance is browser-controlled.

## Date presentation correction — 2026-10-27

With Selection artboard `653A18EF-07CE-43C4-92FE-6D66E5DE94F1` shows End date
`12.30.2025` before Start date `12.23.2025`. Per user clarification, display the
fields in that order using MM.DD.YYYY. This supersedes the earlier ISO input-format
adaptation. ISO YYYY-MM-DD remains the internal model and persistence format;
only the datepicker parser/formatter changes. Placeholders and errors describe the
new display format. Both field blocks retain their labels and calendar buttons.

Typography correction after review: the official font stylesheet maps Medium to
CSS weight600 and Book to500. Apply these to the panel title and description/actions
respectively; earlier weight assumptions did not select the intended font faces.
