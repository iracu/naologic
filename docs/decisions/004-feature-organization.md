# ADR 004: Feature-local schedule organization

Date: 2026-10-26. Status: accepted.

Group the schedule under `apps/web/src/app/features/work-order-schedule`. Its standalone
WorkOrderSchedule container owns the existing page composition, signals, data-service
consumption, HTML, SCSS, and zoom integration spec. App remains the bootstrap shell
with its existing rendering test. This supersedes ADR 002's use of App as the schedule
coordinator; date rules and behavior from ADRs 002 and 003 are unchanged.

Child components live under `components/<component-name>/`, with colocated TS, HTML,
SCSS, and any component specs. Extract the toolbar's inline template without changing
its content. The existing toolbar-named test exercises the whole schedule, so it
belongs beside the feature container. Do not add empty tests just for symmetry.

Keep `domain` (models and pure date functions) and `data-access` (fixtures and readonly
service) inside the feature. Preserve the service's existing root provider scope.
Use direct imports, standalone components, OnPush, and existing Angular 22 conventions.
No NgModules, NGXS, routing, barrel exports, core/shared folders, or dependencies added.

The user requested AutoRoom as an organizational reference:
https://github.com/iracu/autoroom. Its public page returned 404 and Git access required
unavailable authentication. No AutoRoom source was inspected or copied; this change
follows the feature and component organization explicitly requested by the user.
A local checkout or accessible reference is needed to verify correspondence to AutoRoom.

Verification: preserve all 25 existing assertions/tests across six spec files, compare
moved domain/data/style files against the pre-refactor working tree, and run production
build, unit tests, formatting, and E2E configuration checks. No visual redesign or new
behavior belongs to this refactor.
