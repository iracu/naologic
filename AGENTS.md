# Repository working agreement

## User workflow

- Prefer the existing primary checkout. Do not create a worktree without explicit approval.
- Before switching branches with local changes, stash tracked and untracked files with a clear name recording the original branch. Preserve that stash until asked to remove it and report the recovery command.
- Preserve IntelliJ project configuration and local run/test settings.
- Do not commit, push, or publish unless explicitly asked.

## Agent workflow

- Use `tools/agent/README.md` to choose the relevant persona and load shared working conventions.
- Personas are sequential working modes by default, not permission to spawn agents or expand scope.
- For documentation-only changes, verify formatting, links, and instruction consistency; app build/test gates apply when their code or configuration changes.

## Source of truth and scope

- Read `docs/requirements/FE-technical-test-10-2026.md` completely before changes. Preserve the original assignment.
- Consult `tools/agent/requirements-checklist.md` and keep implementation status honest.
- This foundation contains no timeline UI. Implement features only when requested.
- Measure Sketch before styling. Record source/artboard/state with each measurement in `docs/design`; never invent colors, spacing, dimensions, or typography values.
- Mandatory requirements precede bonuses. No backend, persistence, state framework, SSR, or extra UI library without a demonstrated requirement.
- Record significant AI prompts in `docs/ai-prompts` and consequential decisions in short ADRs.

## Architecture

- Use npm workspaces: `apps/web` and `apps/e2e`; maintain one root lockfile.
- `apps/web/src/app/domain` contains framework-independent TypeScript models and future pure scheduling rules. No Angular, DOM, storage, or component imports here.
- `data-access` owns local in-memory data and exposes readonly state. Components must not mutate fixtures or service state directly.
- Components coordinate inputs, events, forms, and presentation; move date math and validation rules into pure functions with explicit inputs.
- Keep feature components small. Extract abstractions only when they have a concrete caller or repeated use.

## Angular and code quality

- Standalone components, OnPush change detection, strict TypeScript and strict templates; no unjustified `any` or non-null assertions.
- Use typed Reactive Forms with FormGroup/FormControl/Validators, ng-select for selects, and ngb-datepicker for dates when implementing the panel.
- Prefer signals for synchronous local state; use RxJS when there is a genuine asynchronous stream. No global store for this exercise.
- Use modern template control flow and stable document IDs for tracking. All authored styles use SCSS.
- Preserve the required document envelopes and status literals. Calendar dates remain YYYY-MM-DD values; avoid implicit local/UTC conversions.
- Decide interval endpoint semantics before overlap validation or bar sizing. Exclude the edited order from overlap checks.
- Comment non-obvious date calculations and trade-offs, not obvious syntax. Format with Prettier.

## Testing and accessibility

- Run `npm run format:check`, `npm run build`, `npm test`, `npm run typecheck:e2e`, and `npm run e2e:list` for foundation changes.
- Add meaningful tests for date boundaries, leap years, DST, overlap, edit exclusion, and form validation as those behaviors are implemented.
- Playwright is configuration-only initially. Add user-observable scenarios with features; never present empty discovery as a passing browser suite.
- Use semantic elements, accessible names, explicit form labels, and errors associated with fields. Do not convey status through color alone.
- When the panel exists, manage initial focus and focus return; provide keyboard-operable menus, visible focus, and a close mechanism. Verify horizontal scrolling at narrow widths.
- Do not add snapshots or tests that merely duplicate implementation details.

## Completion

- Follow `tools/agent/review-checklist.md`; report changes, actual checks and failures, limitations, and next steps.
- Explain uncertain dependency choices before installing. Do not bypass peer dependency or engine constraints.
