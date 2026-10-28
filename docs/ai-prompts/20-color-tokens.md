# Centralized SCSS colors

## Request

Use the frontend-engineer persona to extract hardcoded application colors into a
central SCSS token file, use semantic names and `@use`, avoid duplicates, preserve
appearance and behavior, and run build and formatting checks. Do not commit or push.

## Implementation

- Add `apps/web/src/styles/_colors.scss` as the single source for authored SCSS colors.
- Reuse shared tokens and name status-specific backgrounds, borders, badges, and text.
- Use namespaced relative `@use` imports in all seven consuming stylesheets.
- Interpolate Sass variables in CSS custom properties so emitted values stay valid.
- Leave third-party theme source, test expectations, and the exported logo asset intact.
- Compile each stylesheet before and after the refactor and compare its compressed CSS
  byte-for-byte to verify that the refactor preserves all emitted styles.
