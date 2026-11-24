---
name: ui-change-flow
description: >
  End-to-end UI change process for HyperShell web-console work: classify the
  change, update the owning spec, implement, determine every applicable check,
  validate to completion, trigger human UI review when required, and publish
  Fullsend-ready PR evidence. Use for every new or changed production UI.
---

# UI change flow

This is the only entry point for HyperShell web-console UI work. Other UI
documents under this skill are references; the build gate under
`skills/build/ui-build-gate` is an optional completion utility invoked from this
flow. Do not follow a separate UI-spec, visual-input, check-catalog, UI-standards,
or PatternFly workflow.

## Non-negotiable rules

- Specs, not attached issues or mockups, are the durable source of intent.
- A mockup is an optional input. Never create one only to satisfy this flow.
- Classify risk as Tier 0, Tier 1, or Tier 2. Use the Tier 0 copy-only fast
  path only when every eligibility condition in this flow is met; otherwise do
  not use the tier to narrow validation. A check may be omitted only when it
  cannot apply to the changed UI.
- Run implementation → validation → fix until every applicable check passes or
  a real blocker is documented. A failed check is implementation work.
- Fullsend owns all `agent/*` labels. Emit a structured result; never add or
  remove a lifecycle label directly.
- Human UI review, when triggered, blocks automatic merge eligibility but does
  not stop automated code review.

## 1. Intake and classify

1. Read the work item and identify every input: text description, screenshot,
   static mockup, interactive mockup, existing UI, or a combination. Record where
   each input came from. Inputs usually remain attached to the Jira or GitHub item.
   For a static image input, open and inspect the image in an image-capable
   runtime. If the runtime cannot inspect the image, record that capability
   limit and ask for a text inventory or an accessible mockup story; do not
   guess the visible elements or PatternFly mapping from the filename alone.
2. Inspect the affected production component, owning spec, positive pattern
   library, and relevant shared UI package before choosing a tier.
3. Classify the change:
   - **Tier 0: exact match.** The implementation already matches the approved
     spec, mockup, and established pattern; only localized copy, tokens, props,
     or fixtures change.
   - **Tier 1: normalized implementation.** A new composition uses only existing
     approved patterns, components, terminology, and interaction conventions,
     and still matches the approved spec or mockup.
   - **Tier 2: structural or divergence risk.** The change introduces a new page,
     navigation change, cross-page change, new shared component or pattern,
     materially changed responsive behavior, or any deviation from the approved
     spec, mockup, or established pattern.
4. Record the tier and a one-to-three sentence rationale. If classification is
   uncertain, choose the higher tier and say why.

### Tier 0 copy-only fast path

Use this fast path only when all of the following are true:

- The production component, route, props, state, data flow, layout, navigation,
  and accessibility semantics are unchanged.
- The only production change is localized text or a message ID used by an
  existing approved PatternFly component.
- The component still uses the same existing HyperShell or approved
  PatternFly component.
- Any repository mockup change only updates the same visible text.

If any condition is uncertain, use the normal Tier 0 process rather than the
fast path. The fast path does not apply to new or changed components, routes,
layouts, interactions, states, props, fixtures, tokens, visual hierarchy,
accessibility semantics, shared packages, or non-localized user-visible copy.

Required evidence: tier, rationale, input inventory, affected surfaces, and
whether each input is text, static, interactive, or an existing UI.

## 2. Create or update the spec

1. Locate the owning spec. Do not rely on the issue, Jira item, or mockup as the
   permanent behavioral description.
2. Make the tier-based spec decision:
   - Tier 0 normally makes no spec change. If requested behavior is observable
     and not represented, update the spec anyway.
   - Tier 1 updates acceptance criteria or state coverage when the existing spec
     does not describe the requested behavior.
   - Tier 2 creates or updates the owning spec before implementation.
3. Make the spec self-contained: required behavior, structure, states,
   terminology, constraints, and observable outcomes. Do not make the spec depend
   on reading a linked issue or attachment.
4. If an approved screenshot or visual reference is part of a feature-spec
   deliverable and repository policy requires a repository mockup, create the
   mockup and design-review story using the references below. Otherwise, keep an
   attached mockup as intent and do not create a repository mockup.

Required evidence: owning spec path, decision made, and, when used, the source
visual reference and repository mockup story.

## 3. Implement

1. Implement only against the approved spec and the applicable HyperShell and
   PatternFly references in this skill.
2. Follow component-selection order exactly:
   1. Existing HyperShell component or approved positive pattern.
   2. PatternFly 6 component or documented pattern.
   3. Composition of PatternFly primitives.
   4. New shared component only after a documented search proves a genuine gap.
3. Keep live data, routing, session, API, and infrastructure effects outside the
   presentation view.
4. If implementation reveals missing behavior, return to the spec decision before
   continuing. Do not silently expand scope.

Required evidence: selected component or pattern, reuse rationale, spec
conformance, and any intentional deviation with authority to make it.

## 4. Determine every applicable check

For a Tier 0 copy-only change, use the precomputed applicability matrix below.
Read an individual check reference only when a matrix entry is unclear or the
change fails an eligibility condition. For every other UI change, read all
check files in `references/checks/`. Build a written applicability table; do
not copy their requirements into the PR. For each check, record `applies`,
`does not apply`, or `blocked`, plus evidence.

| Check | Reference | Always consider |
|---|---|---|
| Rules and design | `references/checks/rules-and-design.md` | Component choice, tokens, presentation boundary, forbidden DOM injection, deviations |
| Coverage | `references/checks/coverage.md` | Happy, empty, loading, error, unauthorized, role, modes, responsive, Storybook |
| Accessibility | `references/checks/accessibility.md` | Keyboard, focus, semantics, contrast, non-color status, screen reader |
| Usability heuristics | `references/checks/usability-heuristics.md` | Progress, forms, validation timing, dynamic behavior, findability |
| Conformance and automation | `references/checks/conformance.md` | Spec, work item, tests, build, lint, type, Storybook, command evidence |
| Visual input | `references/checks/visual-input.md` | Input normalization, deviations, transient artifacts, mockup reuse |
| New pattern | `references/checks/new-pattern-determination.md` | Reuse search, candidate contract, library admission, human review |

Tier 0 copy-only applicability matrix:

| Check | Applicability | Required evidence |
|---|---|---|
| Rules and design | Applies | Confirm the component and PatternFly usage are unchanged and the text remains in the localized message model. |
| Coverage | Applies | Run the focused tests for the affected component or feature and confirm existing states are unchanged. |
| Accessibility | Applies | Inspect the rendered element or its test to confirm label text, semantics, keyboard operability, focus behavior, and target are unchanged. |
| Usability heuristics | Applies | Confirm the new text is clear, accurate, and does not change an action or state meaning. |
| Conformance and automation | Applies | Run i18n extraction/check, the focused component test, the forbidden DOM-injection scan, and the affected package gate required by repository policy. |
| Visual input | Applies only when a repository mockup changes | Update the same text in the existing mockup and run its focused test or typecheck. |
| New pattern | Does not apply | The existing component and pattern remain unchanged. |

A Tier 0 change that is not copy-only still receives applicable accessibility,
design, coverage, conformance, and usability checks. For example, link text,
semantics, keyboard operability, focus, target, and surrounding state must be
checked.

Required evidence: the applicability table and the reason each omitted check
cannot apply to this change.

## 5. Propose a new pattern only after proving a gap

1. Search `specs/web-console/patterns/index.yaml`, relevant foundations and
   patterns, HyperShell production components, shared UI packages, Storybook
   stories, and applicable PatternFly 6 documentation.
2. Record each searched component or pattern and why it cannot meet the required
   behavior, accessibility, states, or data contract.
3. Extend the closest existing pattern when it already owns the user intent.
4. Only after a genuine gap remains, add a candidate pattern document, update
   `index.yaml`, and add a deterministic canonical Storybook example.
5. Define API, states, accessibility, responsive behavior, terminology, and
   integration boundaries.
6. Run:

   ```bash
   python3 skills/web-console/ui-change-flow/scripts/check_ui_pattern_library.py
   ```

Creating or materially changing a shared pattern changes the work to Tier 2 and
requires human UI review. A pattern remains `candidate` until human review
approves its contract and canonical example.

Required evidence: search inventory, rejection reasons, pattern document,
index entry, story, checker result, and human-review trigger.

## 6. Validate to completion

1. Run every applicable check from the applicability table.
2. If any check fails or inspection finds a defect, stop the completion path,
   return to implementation, fix it, and rerun the checks affected by the fix.
3. Repeat until all applicable checks pass or a genuine external blocker is
   documented. An unimplemented state or known mismatch is not a blocker.
4. Use the command matrix in `references/checks/conformance.md`. At minimum,
   browser UI changes require:

   ```bash
   make check-forbidden-dom-injection
   ```

5. Run the broader repository checks required by the changed packages. Do not
   replace type, lint, unit, build, or Storybook checks with a visual review.
   For a Tier 0 copy-only change, run the affected package gate and repository
   policy checks; do not run unrelated frontend package gates.
6. For a new or materially changed production page with an approved repository
   mockup, execute `skills/build/ui-build-gate/SKILL.md` and wait for its terminal
   state. If the runtime cannot inspect images, use its documented
   `Complete without visual review` path and continue all non-parity checks.
7. Do not commit generated screenshots, HAR files, or parity artifacts. Store
   task-local evidence outside the PR or use the gate's untracked evidence path.

Required evidence: command or inspection, result, failures found, fixes made,
rerun result, build-gate terminal state when applicable, and any documented blocker.

## 7. Determine human UI review

Set `human_review_required: true` when any trigger applies:

- The final built item differs from the approved spec, work item, or mockup.
- The change introduces structural or pattern risk, including Tier 2 work.
- No static or interactive mockup was provided and the change is beyond Tier 0.
- No visual input was provided and the agent made Tier 1 or Tier 2 design decisions.
- A spec, requirement, status model, interaction pattern, or shared component
  contract changed.
- Accessibility or usability risk could not be resolved automatically.
- A new pattern was proposed or created.

For each trigger, explain what decision was made, why it needs human judgment,
and what the human should verify. If no trigger applies, explicitly record that
decision and the reason.

When a trigger applies, the completed code-implementation result includes both:

```json
{
  "human_review_required": true,
  "human_review_reason": "<trigger and concrete verification request>"
}
```

Fullsend adds `agent/reviewable-code` and `agent/human-review-required` together
in one issue label-add request, then adds the human-review gate and the same
review explanation to the linked PR. Automated code review continues. Mergify
cannot merge the PR while it has `agent/human-review-required`; after human
review, a person manually removes that label from both the issue and PR.
Non-UI PRs are not blocked by the absence of UI review labels.

## 8. Publish PR evidence

The PR description must contain an implementation record with:

- UI tier and rationale.
- Input inventory and spec reference.
- Component or pattern reuse decision.
- New-pattern search evidence and proposed contract, if applicable.
- Storybook and state coverage.
- Applicability table and omitted-check reasons.
- Commands and inspections run, with pass/fail results and fix loops.
- Design and accessibility conclusions.
- Intentional deviations and their authority.
- Human-review trigger and verification request, or an explicit no-trigger reason.
- Build-gate terminal state when applicable.

Do not report UI work as complete while evidence is missing, a check is pending,
or a known visual mismatch remains.

## 9. Emit the Fullsend result

When implementation and PR evidence are complete, emit the code-implementation
structured result using `.fullsend/schemas/code-implementation-result.schema.json`.
For a completed result, include `schema_version`, `phase`, `outcome`,
`rationale`, `pr_number`, `head_sha`, and, when triggered, the two human-review
fields above. Use `blocked` only for a hard external prerequisite failure, not
for unfinished implementation or validation.

Example completed human-review result:

```json
{
  "schema_version": "1",
  "phase": "code-implementation",
  "outcome": "completed",
  "rationale": "Implemented the approved Tier 2 spec and completed all applicable checks.",
  "pr_number": 123,
  "head_sha": "0123456",
  "human_review_required": true,
  "human_review_reason": "Tier 2 layout change with no mockup; verify the final navigation and empty/error states."
}
```

Fullsend maps the result to the lifecycle:

| UI step | Fullsend phase |
|---|---|
| Intake and classification | Triage, then spec implementation setup |
| Spec decision and update | Spec implementation |
| Spec approval | Spec review |
| Implementation, checks, validation, and human-review decision | Code implementation |
| Parallel human UI review and automated code review | Code implementation and code review |
| PR evidence and merge eligibility | Code-implementation handoff and code review |

## References

- `references/ui-conventions.md`
- `references/ui-standards.md`
- `references/visual-input.md`
- `references/patternfly.md`
- `references/patternfly-mockup-implementation.md`
- `references/mockup-story-structure.md`
- `references/checks/`
- `specs/web-console/patterns/`
- `skills/build/ui-build-gate/SKILL.md`
