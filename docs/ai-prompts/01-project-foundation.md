# Project foundation prompt

Date: 2026-10-25

## Original prompt

```text
You are a senior Angular architect and frontend engineer preparing a technical assessment for Naologic.

Read docs/requirements/FE-technical-test-10-2026.md completely before making any changes.

Goal: Set up a clean, maintainable repository foundation for the Work Order Schedule Timeline technical test.

Architecture:
- Lightweight npm workspaces monorepo
- apps/web: Angular 17+ standalone application, TypeScript strict mode, SCSS
- apps/e2e: Playwright tests (initial configuration only)
- tools/agent: lightweight agent instructions, review checklist and working conventions
- docs/requirements: original assignment
- docs/design: design notes and measured tokens
- docs/ai-prompts: record significant AI prompts
- docs/decisions: short architectural decision records

Use a local data service and in-memory sample data. localStorage may be added later as a bonus.

Tasks:
1. Inspect the environment and existing repository.
2. Propose the final folder structure and implementation plan.
3. Create AGENTS.md with rules for architecture, Angular conventions, code quality, testing, accessibility, and scope control.
4. Create a concise frontend-engineer agent persona under tools/agent, plus a requirements checklist.
5. Set up the npm workspace, Angular app and Playwright project with compatible versions.
6. Create README.md with setup and development commands.
7. Create docs/ai-prompts/01-project-foundation.md containing this prompt and key decisions.
8. Verify install, build and initial tests.

Important constraints:
- Do not implement the timeline UI yet.
- Do not invent design tokens or visual specifications.
- Keep business logic independent from Angular components.
- Prefer simple solutions and small focused components.
- Do not create commits unless I explicitly ask.
- If a dependency or setup choice is uncertain, explain it before proceeding.

At the end, report:
- Folder tree
- Dependencies and reasons
- Commands executed and results
- Architectural decisions
- Remaining questions or blockers
- Recommended next implementation step.
```

## Key decisions

- Read the entire assignment before modifying files; preserve it verbatim.
- Two private npm workspaces, one root lockfile, no monorepo orchestration dependency.
- Use existing nvm Node 22.23.2 without changing the global default.
- Initially evaluated Angular 21; its install audit revealed vulnerable builder dependencies. Switched to Angular 22.2 with compatible mandatory UI libraries and TypeScript 6 after explaining the change. No forced overrides.
- Plain TypeScript readonly models and deterministic fixture factory; local Angular service supplies today and exposes in-memory state. No persistence or CRUD yet.
- Five centers/eight orders with every status; relative date spans keep the future initial viewport useful.
- Unstyled shell only. No invented design tokens or timeline implementation.
- Vitest/jsdom foundation tests; Playwright configuration only, with empty discovery clearly identified.
- Design measurement and interval endpoint semantics remain pending.
- Evaluated the audit-suggested Angular 22.1 tooling downgrade, rejected it because of additional advisories, and retained 22.2 with compatible undici update. Two Vite/build audit findings remain documented; no force or overrides used.
- No commits, branch changes, worktrees, or changes to IntelliJ settings.

See [ADR 001](../decisions/001-project-foundation.md) and [README](../../README.md) for the final stack and commands.
