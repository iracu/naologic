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

## Timescale control correction — 2026-10-27

Source: downloaded original FE Take-Home Challenge.sketch, Default artboard
387C1050-210D-4B00-9B6F-4E17B6A2D6FD, corresponding to the user's linked QGPyj7
Inspect frame. The web Inspect URL could not be read by the web tool; layer JSON from
the matching local artboard supplied measurements.

- Outer Rectangle 2 (46A342DB): x101/y155, 146×25, radius5, white, no enabled border;
  enabled shadow x1/y2.5/blur3/spread-1.5, #C8CFE9.
- Label rectangle: x101/y155, 75×25; fill #F1F3F8 at75% opacity.
- Timescale text: x109/y159, 59×16, CircularStd-Book13, #687196.
- Selector rectangle: x176/y155, 71×25; its gray fill is disabled (white outer base).
- Month text: x184/y159, 40×16, CircularStd-Medium13, #3E40DB.
- Down arrow instance: x230.535/y165.906, 8.465×5, #687196.

Closed-control measurements now replace the vendor control's default border, height
and padding. Options retain vendor behavior. The CSS chevron approximates the source
vector's rounded corners; focus outline is an accessibility adaptation. Day/Week reuse
the same fixed control geometry. The separately requested Today button remains.

## Full-height canvas and hover correction — 2026-10-27

Source: Default artboard in the original Sketch file, compared with the user's two
screenshots. The first image is a scaled Month design; the app screenshot is full-size
Day with user data. Retain required Day default and saved work orders.

- Canvas starts y204 and extends to the artboard bottom y1024. Sidebar background
  AC6F8A15 extends to1024; grid background 6025416D to1022. Vertical separators in
  Group5 continue below the final work center. Use a viewport-filling flex layout,
  with a decorative continuation (not fake interactive work-center rows).
- First row is60px (5C34004E); later rows49px. First bar y249 gives11px top inset.
  Horizontal row separators are confined to the sidebar; grid lines remain vertical.
- Current month badge 57ECFF97: 109×22, radius5, #D4D7FF, 14px Book/18px,
  #3E40DB, padding2px8px. Day/Week labels adapt to Today/Current week, retaining
  the actual day's indicator position required by the assignment.
- Empty hover rectangle 999610B0:113×38, radius8, border1 #C3C7FF,
  fill rgb(101,112,255) at10%. Hint 7B64FD40:130×26, radius8, #687196,
  14px Book/18px #F9FAFF, inset8px4px, 5px above the preview.
- Pointer-following preview is an interaction adaptation; its pointer events are
  disabled so the original click-to-create geometry remains authoritative.
- Heading-to-toolbar gap26px and toolbar-to-grid gap24px restore toolbar y155 and
  grid y204. Today uses25px height to fit the measured toolbar row (bonus adaptation).

This supersedes the initial uniform-first-row, content-height-only, no-badge and
no-logo scope limits above. Gray outside the design frame is Sketch's workspace,
not an application background. Current data and shorter Month bars still differ
from the reference's example companies and date ranges.

## Work Center typography correction — 2026-10-27

Rechecked raw Default artboard text layers: Work Center
`DF5D85B8-2B4B-4AE6-B171-C3585CBB5622`, Genesis Hardware
`3F34FB70-6D68-450C-9BB2-86A065D7521A`, and Konsulting Inc
`243FC739-F3FF-427E-9906-798E20BC5700`. All specify CircularStd-Regular,
14px, with 16px-high text frames. The supplied official font stylesheet maps
Regular to CSS weight400; weight500 loads Book. Sep 2024
`5D16128F-E866-4ACB-8E12-6428C4212279` uses the same Regular typography.

This corrects the earlier weight500/17px measurements above. Headers and work
center names now use weight400/16px, retaining the measured colors, 380px sidebar,
31px text inset, and 60px first/49px subsequent row geometry. Company names remain
the assignment's manufacturing sample data rather than copying Sketch's examples.

## Work Center hover border correction

User clarification (2026-10-27): the hovered Work Center cell has no visible top
border. Make its top border transparent on row hover, retaining the 1px border
space to prevent layout movement. Restore the separator when hover ends.
