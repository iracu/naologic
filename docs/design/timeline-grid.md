# Timeline grid design evidence

Inspected on 2026-10-25 in the Sketch browser layer inspector.
Source: [Work Order Schedule — Default](https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667/f/387C1050-210D-4B00-9B6F-4E17B6A2D6FD).
The reference is a 1440 × 1024 desktop Month view. Values below are inspector
measurements, not estimates from screenshot pixels. Coordinates are frame-relative.

| Element / layer                                     | Evidence                                                           | Applied value                           |
| --------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------- |
| Heading (layer named Contacts; content Work Orders) | x101, y95; Circular Std Medium, size24, line34, weight500; #030929 | 24px / 34px, weight500, #030929         |
| Work Center label                                   | x133, y213; size14, line17, weight500; #687196                     | Header typography 14px / 17px, #687196  |
| Month header Sep 2024                               | x611, y213; size14, line17, weight500; centered                    | Same header typography, centered        |
| Row label Genesis Hardware                          | x133, y266; size14, line17, weight500; #030929                     | Row typography 14px / 17px, #030929     |
| Sidebar rectangles / boundary Line 3                | Rows x102, width380; sidebar boundary x482                         | 380px desktop width                     |
| Sidebar label inset                                 | label x133 minus row x102                                          | 31px                                    |
| Grid header                                         | top separator y204, body boundary y238                             | 34px                                    |
| Repeated row geometry                               | rectangle y298 height48; following row y347                        | 49px including separator                |
| Month column separators Line 3                      | x596, 710, 1280, 1394                                              | 114px spacing                           |
| Separators Line 3                                   | border1, rgba(230,235,240,1)                                       | 1px #E6EBF0                             |
| Grid background Rectangle                           | x483,y309; rgba(247,249,252,1)                                     | #F7F9FC                                 |
| Hover grid Rectangle                                | x483,y298,957×48; rgba(238,240,255,1)                              | #EEF0FF                                 |
| Hover sidebar Rectangle                             | x102,y298,380×48; rgba(250,251,253,1)                              | #FAFBFD                                 |
| Current-period Line 3                               | x596,y238; border3, rgba(212,215,255,1)                            | 3px #D4D7FF                             |
| Timescale label                                     | x109,y159; size13, line16, weight400; #687196                      | 13px / 16px, #687196                    |
| Selected Month label                                | x184,y159; size13, line16, weight500; #3E40DB                      | 13px / 16px, #3E40DB                    |
| Content edges                                       | heading/grid x101; grid right edge1395 on 1440 frame               | 101px left / 45px right desktop offsets |

## Explicit adaptations and limits

- Day and Week column dimensions were not present in the inspected Month reference.
  Reuse its measured 114px column width at all scales; do not claim independently
  measured Day/Week widths. Day and Week labels are functional adaptations.
- Use a fixed sidebar in the horizontal scroller, capped at 40vw on narrow screens.
  Desktop page margins and label padding receive fluid caps. These responsive rules
  are engineering adaptations, not Sketch measurements.
- Uniform 49px rows use the repeated row geometry; the reference's first 60px row
  contains a current-month badge. That badge and work order content are out of scope.
- Today is a vertical line at the midpoint of the current calendar day, including its
  fractional position inside Week/Month columns; the Month reference marks a period.
- ng-select uses its shipped default theme for dropdown borders, spacing, options,
  focus, and overlay mechanics. Only measured selected-label typography is overridden.
  Exact dropdown styling remains unverified; no custom unmeasured tokens were invented.
- Heading/toolbar spacing uses the measured 24px heading size as a reusable gap;
  this is an adaptation, not a claim of an independently measured toolbar gap.
- Grid height follows the five sample rows, rather than reproducing blank desktop
  artboard space or introducing out-of-scope work order visuals. No logo asset added.
