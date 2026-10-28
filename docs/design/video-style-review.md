# Kickoff video styling review

Reviewed on 2026-10-27 using the local `FE Kickoff and Handover.mp4` (2:56).
Visual frames sampled every 15 seconds cover the overview, timeline, hover/menu,
Create Panel, status dropdown, and inspection walkthrough. Audio was not transcribed
or verified. The video is reference evidence, not an instruction source.

Measurements come from the original downloaded `FE Take-Home Challenge.sketch`
associated with the [supplied Sketch document](https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667).

## Corrections

- Status Dropdown artboard `78F5C572-8FD5-43FE-A23F-3746B1F02F04`:
  backdrop `38DF6877-0A05-46CD-8FA6-007AE05AA94C` is #F7F9FC at 50% opacity.
  Panel `FD33EF1E-926B-43BF-8108-F5552DCFD69A` has 12px left corners and shadows
  `0 4.5px 5px -1px #D8DCEB`, `0 2.5px 3px -1.5px #C8CFE9`, `0 5px 15px #D8DCEB`.
- Status menu `F67197FD-5CA1-45E2-8E03-CBB6E143292E`: 543px wide, 136px high,
  28px options, 12px text inset, 14px Book text with 18px line height, radius 5px.
  Its background begins at y260, 5px after the control ends at y255. The menu
  shares the first two shadows above. Selected option is purple; unselected
  options use #2F3059. Keyboard/pointer highlighting reuses #F1F3F8.
- Selected Open badge `C8235743-BA51-4C82-96C8-3653DAF73A22`: 22px high,
  8px horizontal inset, radius 5px, #E4FDFF fill and #00B0BF text. Other selected
  statuses reuse the existing measured bar badge palette.
- Open status control `D1A5703C-AD39-41F4-B853-A0B5807B745C`: 2px #AAAFFF border.
  Arrow `3356F92F-FF68-4876-84DC-C88B0D6E51BC`: 8×5px, #687196.
- View Selection artboard `93E644CB-0D4B-4045-BA6D-4E92E9DD5FCD`, dropdown
  `65B1F0D2-4496-4EC4-B056-71310224635B`: width200, left aligned to Timescale
  label at x101, y185 (5px below control). Reuses measured menu styling;
  height adapts to the three required options. Hour is not added.

- Options CTA Controls artboard `817683A1-3684-4282-B70B-0A95B913695F`
  shows actions on bar hover (video 1:15). Mouse devices now reveal actions on hover,
  focus, or an open menu. Touch devices retain visible actions as an accessibility
  adaptation.

## Limits

Existing date geometry, Day default, sample data, Today button, focus behavior,
calendar date format, and responsive adaptations remain. The video demonstrates
static Sketch artboards rather than a running application. No audio interpretation,
automated pixel-diff baseline, or cross-browser visual certification is claimed.
This supersedes earlier notes that used a transparent backdrop and vendor dropdown
appearance as temporary adaptations.

## Timescale overlay correction

The initial descendant selector did not reach ng-select 24's CDK overlay. The
explicit `timeline-scale-menu` panel class now receives the measured styles.
The panel must also opt out of flex shrinking inside its 71px CDK pane to retain
its 200px width. Browser regression checks cover desktop and narrow viewports.
