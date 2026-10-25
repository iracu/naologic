# Review checklist

Apply this to the requested change. Mark each applicable item passed, failed, or not
verified in the review summary; mark unrelated items N/A with a short reason. This is
not the delivery-status checklist. Findings use the code-reviewer output convention.

## Scope and architecture

- [ ] Scope matches the request; required features precede bonuses.
- [ ] Existing work, original assignment, and local IDE configuration are preserved.
- [ ] Domain rules have no Angular/browser dependencies; components remain focused.
- [ ] State has a clear owner; no accidental fixture or shared-object mutation.
- [ ] Strict types and document contracts are preserved; abstractions have concrete uses.

## Behavior and presentation, when touched

- [ ] Calendar/date conversion and endpoint semantics are explicit and consistent.
- [ ] Overlap checks cover same-center conflicts and exclude the edited order.
- [ ] Form validation, defaults, resets, cancellation, and error feedback match requirements.
- [ ] Zoom, scrolling, click positions, menus, and deletion preserve expected behavior.
- [ ] Visual values cite measured evidence; responsive and interactive states are checked.
- [ ] Labels, keyboard operation, focus management, and associated errors are verified.

## Evidence and handoff

- [ ] Applicable checks from working-conventions.md were executed; results are reported.
- [ ] Tests cover meaningful behavior and failure paths; no empty-suite coverage claims.
- [ ] Findings identify a location, trigger, impact, severity, and correction direction.
- [ ] Dependency findings and unverified behavior remain explicit.
- [ ] Documentation, significant prompts, and affected requirement statuses are current.
- [ ] Conclusion describes only reviewed scope; no commit/publication without authorization.
