# Agent guide

These personas are working modes for this repository, not an agent runtime. Start
with the root [working agreement](../../AGENTS.md), then the relevant persona and
[working conventions](working-conventions.md). User instructions and the root
agreement govern all modes. These files do not authorize additional agents or tasks.

## Choose a role

| Task                                                         | Persona                                   | Expected result                                                  |
| ------------------------------------------------------------ | ----------------------------------------- | ---------------------------------------------------------------- |
| Implement or fix an Angular feature; assess its architecture | [Frontend engineer](frontend-engineer.md) | Focused change, relevant tests, implementation summary           |
| Inspect Sketch and translate evidence into UI specifications | [Design analyst](design-analyst.md)       | Measured values, interaction states, unresolved design questions |
| Inspect a change for defects and requirement gaps            | [Code reviewer](code-reviewer.md)         | Prioritized findings with file locations and impact              |
| Validate implemented behavior against requirements           | [QA engineer](qa-engineer.md)             | Executed checks, reproducible defects, coverage gaps             |

One agent can use these modes sequentially. Use only roles relevant to the request;
a documentation correction does not need a full design/implementation/QA cycle.
A self-review must be described as a self-review, not an independent review.
Review-only requests produce findings; requests to fix findings also authorize an
explicit switch to implementation within the requested scope.

## Context and handoff

Read the original assignment completely before changing the repository. Load relevant
ADRs and design evidence, inspect the actual files, and select the requirements in
scope from the [requirements checklist](requirements-checklist.md). The checklist
tracks delivery status; the [review checklist](review-checklist.md) evaluates a change.

For a handoff or final response, include only the fields that add useful context:

- Scope: requested behavior and relevant requirement/checklist heading.
- Evidence: files changed or inspected, design sources, commands and actual results.
- Decisions: assumptions resolved, chosen approach, and important trade-offs.
- Findings: actionable defects, affected behavior, and severity.
- Remaining work: unverified cases, blocked requirements, and the next concrete step.

Keep this in the conversation for routine work. Save durable design evidence under
`docs/design`, consequential decisions under `docs/decisions`, and significant prompts
under `docs/ai-prompts`. Do not introduce duplicate status files or machine handoff protocols.
