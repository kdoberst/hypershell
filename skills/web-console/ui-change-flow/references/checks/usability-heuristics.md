# Usability Heuristic Checks

## Purpose

These checks evaluate whether the changed interaction helps users understand,
predict, control, and recover from the task. They supplement pattern and
accessibility checks; they do not replace them.

Run every applicable heuristic for an interactive UI change. The UI tier does
not remove a heuristic. Depth increases with workflow complexity and
consequence, not with tier.

| ID | Heuristic | Run when | Evidence | Fail when |
|----|-----------|----------|----------|-----------|
| UH-001 | Task fit | The task, user role, or primary outcome changes | User task, role, and success path | The UI optimizes implementation structure instead of the user task |
| UH-002 | Discoverability | A control, navigation item, or action changes | Control name, state, availability, and predicted result | A control is indistinguishable, unlabeled, ambiguous, or has an unpredictable result |
| UH-003 | System status | An action or async state changes | Feedback for accepted, working, success, partial, failed, and changed states | An action has no perceivable feedback or reports success before durable completion |
| UH-004 | Real-world language | Labels, instructions, errors, or status text change | Terminology decision and user-language rationale | Text uses implementation jargon, inconsistent nouns, or blame-focused error language |
| UH-005 | User control and freedom | A flow, mode, overlay, form, or workflow changes | Cancel, close, Back, Escape, refresh, and recovery behavior | A user cannot safely leave or recover without accidental commitment or unexplained data loss |
| UH-006 | Consistency and standards | A repeated action, status, navigation, or component behavior changes | Mapping to approved HyperShell and PatternFly behavior | Equivalent tasks use different labels, placement, states, or outcomes |
| UH-007 | Error prevention | Input, consequential action, or destructive flow changes | Boundary cases and prevention or confirmation decision | A foreseeable error is allowed, duplicate activation causes duplicate effects, or scope is unclear |
| UH-008 | Recognition over recall | Users must choose, continue, or resume a task | Visible choices, current selection, saved state, and prior context | Required context is hidden, remembered only by the user, or lost unexpectedly |
| UH-009 | Flexibility and efficiency | A frequent or expert task changes | Shortest complete path, defaults, keyboard path, and reuse behavior | A frequent task requires unnecessary repetition or blocks efficient completion |
| UH-010 | Aesthetic and minimal design | Page hierarchy, density, or content emphasis changes | Content hierarchy and removal of unrelated information | Decoration or secondary content competes with the primary decision |
| UH-011 | Error recovery | An error, timeout, partial failure, or permission path changes | Affected item, cause, correction, and retry path | The error is generic, blames the user, loses valid work, or offers no feasible correction |
| UH-012 | Help and documentation | Help, guidance, examples, or instructions change | Placement and task-specific guidance | Help is absent for a complex task, generic, or unavailable at the point of need |

## Interaction-specific checks

### UH-013 - Waiting and progress

- **Run when:** an operation can take more than one second.
- **Check:** acknowledge input promptly, show working feedback after about one
  second, and provide meaningful progress plus safe interruption for waits around
  ten seconds or longer when feasible.
- **Evidence:** latency behavior and progress/cancellation decision.
- **Fail when:** the UI freezes silently, implies precise progress it does not
  have, or prevents safe interruption during a long wait.

### UH-014 - Form economy

- **Run when:** fields, forms, or data entry change.
- **Check:** request only necessary information; use persistent labels, native
  controls, explicit required/format guidance, logical grouping, paste, autofill,
  review, and correction.
- **Evidence:** field purpose and retention decision.
- **Fail when:** a field has no user purpose, labels disappear, valid input is
  rejected, or previously supplied data must be re-entered without reason.

### UH-015 - Validation timing

- **Run when:** validation changes.
- **Check:** validate at meaningful completion events, avoid interrupting valid
  intermediate input, associate errors with fields, and retain errors until
  resolved.
- **Evidence:** validation trigger and correction path.
- **Fail when:** validation interrupts typing or composition, errors are
  disconnected from fields, or corrected input remains marked invalid.

### UH-016 - Predictable dynamic behavior

- **Run when:** live updates, autosave, overlays, filters, sorting, selection, or
  synchronization change.
- **Check:** preserve visible selection and mode; do not move focus, submit,
  dismiss, overwrite, or reset user choices unexpectedly.
- **Evidence:** dynamic-state behavior and announcement decision.
- **Fail when:** an update changes context or destroys user choices without an
  explicit, understandable resolution.

### UH-017 - Navigation and findability

- **Run when:** navigation, routes, deep links, or task entry points change.
- **Check:** keep navigation stable and task-oriented; identify current location;
  support return to a stable point; avoid dead ends.
- **Evidence:** route, Back, refresh, deep-link, and recovery behavior.
- **Fail when:** users cannot determine location, return predictably, or reach
  substantial content through a reasonable route.

## Source

These checks consolidate `specs/standards/ui/interaction.spec.md`, ISO
9241-110 interaction principles, Nielsen usability heuristics, and Shneiderman's
Eight Golden Rules. The interaction spec remains authoritative when more detailed
requirements are needed.
