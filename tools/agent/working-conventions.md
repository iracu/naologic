# Working conventions

## Before work

1. Read root AGENTS.md and the complete assignment; inspect existing changes without
   resetting them. Respect the user's current scope and repository workflow.
2. Read the relevant persona, checklist items, ADRs, and measured design evidence.
3. Identify the smallest coherent outcome, affected files, acceptance examples, and
   verification needed. State material assumptions before implementing them.
4. Resolve questions from available references first. Ask only when a missing answer
   changes correctness, scope, or an irreversible decision; continue independent work.

## During work

- Separate domain rules, data ownership, and presentation. Do not create abstractions
  solely to mirror the persona system or anticipate hypothetical future features.
- Prefer a concrete user-observable slice. Do not implement bonuses or adjacent
  features simply because they appear in the assignment.
- Treat measured design values as evidence. Record missing values instead of guessing.
- Distinguish observed facts from assumptions and proposals. Package installation,
  compilation, and test discovery do not prove a feature works.
- Explain uncertain dependency changes and check actual peer/engine compatibility.
  Record unresolved audit findings without claiming a clean dependency audit.
- Record consequential decisions and significant prompts; leave the original assignment intact.

## Verification proportional to the change

| Change                             | Checks                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Documentation/personas only        | Formatting, local links, consistency with the assignment and root rules                                    |
| Domain logic or data               | Focused behavior/boundary tests, unit suite, production build, formatting                                  |
| Components/forms/styles            | Unit suite, build, formatting, relevant browser/manual checks, measured visual comparison                  |
| Workspace/dependencies/tooling     | Clean install when relevant, build, unit suite, E2E typecheck/discovery, formatting, peer/audit inspection |
| Playwright configuration/scenarios | E2E typecheck and discovery; execute affected scenarios when present                                       |

Record commands actually run and their results. Mark omitted checks as not run, with
reason. Do not count zero-test discovery as browser coverage. Root-required checks
still apply; documentation-only changes do not require rebuilding unchanged app code.

## Review and completion

Use the review checklist on the changed scope. Findings need a trigger, observable
impact, location, and suggested correction; separate confirmed defects from questions.
After a fix, rerun the relevant failing check and inspect the affected behavior.
If repeated attempts fail for the same reason, change approach or report the concrete
blocker instead of looping or adding unrelated changes.

A requested slice is complete only when its acceptance conditions are met and its
verification is reported. The whole assessment remains incomplete while required
features are pending. Preserve unchecked requirements outside the slice.
Do not commit, publish, create worktrees, or message others without authorization.
