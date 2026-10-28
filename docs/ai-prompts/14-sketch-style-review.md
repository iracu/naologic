# Sketch spacing alignment

## User request

Use the `tools/agent/design-analyst.md` persona to review the application's spacing
against the [Sketch design](https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667#Inspect).

Identify incorrect margins, padding, gaps, alignment, and component dimensions.
Measure the relevant Sketch artboards and layers, then record the expected values
and affected components in `docs/design`. Do not invent unavailable measurements.

Use the `tools/agent/frontend-engineer.md` persona to apply the verified spacing
corrections. Preserve existing functionality, colors, typography, accessibility,
and responsive behavior. Avoid unrelated changes or new dependencies.

Verify the corrected layout against Sketch, run the relevant tests, build, and
formatting checks, and report changes and any remaining design evidence gaps.
Do not commit or push changes.

## Working approach

- Use the design analyst for measurement and review, then the frontend engineer
  for implementation, consistent with each persona's scope.
- Record the source artboard/layer, UI state, measured value, and unit for each
  spacing correction.
- Reuse existing components and scoped SCSS; preserve timeline date geometry.
