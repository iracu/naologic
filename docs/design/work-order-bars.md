# Work order bar measurements

Source: [FE Take-Home Challenge](https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667),
original `.sketch` download inspected on 2026-10-25. Values below come from layer JSON,
not screenshot estimates. The downloaded design is not added to the repository.

## Bars and badges

Artboard: **Work Order Schedule - Edit and Delete Controls Expanded**
(`F0742D25-10F4-4E62-8542-BF34A0682FE8`), bar groups and `Controls/Label` layers.
The Default and Options CTA Controls shown on hover artboards show corresponding states.

| Property                                        | Measured value                                  |
| ----------------------------------------------- | ----------------------------------------------- |
| Bar height / corner radius / border             | 38px / 8px / 1px                                |
| Row / bar top inset                             | 49px / 5px                                      |
| Name                                            | Circular Std Book, 14px, 18px text box, #030929 |
| Name inset / trailing inset / badge-trigger gap | 8px / 8px / 4px                                 |
| Badge height / radius / horizontal padding      | 22px / 5px / 8px                                |
| In Progress badge width                         | 87px                                            |
| Complete badge width                            | 79px                                            |
| Blocked badge width                             | 67px                                            |

| Status      | Bar fill | Bar border | Badge fill | Badge text |
| ----------- | -------- | ---------- | ---------- | ---------- |
| In Progress | #EDEEFF  | #DEE0FF    | #D6D8FF    | #3E40DB    |
| Complete    | #F8FFF3  | #D1FAB3    | #E1FFCC    | #08A268    |
| Blocked     | #FFFCF1  | #FFF5CF    | #FCEEB5    | #B13600    |

Open is only represented by `Controls/Label/5` in Create panel artboards: 51×22px,
5px radius, #E4FDFF fill, #CEFBFF border, #00B0BF text. The implementation reuses
this cyan-blue palette for the Open bar; its full bar treatment is **an adaptation**,
not a measured Open timeline state. No new palette is invented.

## Menu

Same expanded artboard, `Dropdown/Simple Copy`:

- Background: 200×80px, 5px radius, white; 1px #687196 border at 10% opacity.
- Items: 28px high, left text inset 12px, first row starts 12px below menu top.
- Text: 14px Circular Std Book, 18px line box; Edit #2F3059, Delete #3E40DB.
- Shadows: `0 4.5px 5px -1px #D8DCEB`, `0 2.5px 3px -1.5px #C8CFE9`.
- Menu starts 5px below the trigger and aligns its left edge with the trigger.
- Item rectangle layers have zero overall opacity in this state. Hover/focus reuse
  the measured trigger hover background #F1F3F8 as an accessibility adaptation.
- Trigger instance is 24×22px; symbol `Buttons/Alt/Icon Subtle/Hover`
  (`CF320AB3-BB22-43B9-AC5A-8456F2150DFD`) has a 5px radius and #F1F3F8 fill.

## Explicit adaptations and limits

The existing grid uses 114px columns in every zoom. Sample orders last only a few
days, yielding 15–30px bars in Month. Widths remain faithful to dates, without a
minimum that would suggest a longer duration or overlap adjacent orders. Below
160px the badge is visually hidden; below 48px only the action trigger fits.
These are implementation fit thresholds, not Sketch tokens. The full name, status,
and dates remain in the trigger's accessible name and native hover title.
Day zoom exposes full labels and badges for the supplied samples.

Menus use the existing CDK overlay, with viewport fallback positioning to avoid
scroll-container clipping. Triggers remain visible for discoverability and keyboard
access. Focus uses the measured purple with a 1px inset outline. These accessibility
states are adaptations, not claims of exact Sketch equivalence.

Visual verification covers the local browser at 1280px, including all zooms and
expanded menu, plus the menu at 390px (contained in the viewport, no page overflow). No automated pixel-diff or cross-browser visual baseline exists;
full pixel perfection is not claimed for unprovided compact/Open/focus states.

## Hover correction — 2026-10-27

User clarification: hovering the bar reveals a white actions button; hovering that
button makes it gray. The bar itself has no hover shadow. Remove the earlier bonus
shadow adaptation. The local Sketch `Buttons/Alt/Icon Subtle/Hover` master
`95B8B0A0-F693-4B40-B1F0-4C41C2024502`, rectangle `6D85C75F`, specifies #F1F3F8,
with no enabled shadow. Its icon group `752E9C60` uses #687196. Use #FFFFFF for the
revealed button, per the user's clarification. Keyboard focus/open-menu styling
retains the same gray background and visible focus outline.

The supplied web Inspect links (layerPath fdec2de6 and 546e0e3f) were inaccessible;
those exact IDs are absent from the downloaded file. Colors above are verified
against the locally available hover symbol, not claimed as a fresh web inspection.

User color correction: the revealed actions background is #F1F3F8, and direct
button hover is #D8DCEB. This supersedes the white/light-gray mapping above.
Keyboard focus and open-menu state use the same darker #D8DCEB treatment.

## Compact details and font mapping after review

Compact bars keep their actions button visible. Per the user correction on
2026-10-28, the menu contains only Edit and Delete; the additional name, status,
and date summary has been removed. Order details remain in the bar tooltip and
accessible action label. This preserves true date widths. Full inline labels still require enough bar
width. The official font stylesheet maps Book to500, Medium to600, and Regular
to400; bar names/menu items use Book while badge labels retain Regular.
