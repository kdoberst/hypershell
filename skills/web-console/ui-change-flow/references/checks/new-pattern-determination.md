# New Pattern Determination

## Purpose

This file decides when an implementation may become a new HyperShell UI pattern.
A pattern is a reusable product decision, not a convenient local component or a
copy of one page's layout.

Any new or materially changed shared pattern requires human review. Set
`human_review_required` to `true` in the Fullsend code-implementation result and
record the reason.

## Decision sequence

| ID | Check | Run when | Evidence | Fail when |
|----|-------|----------|----------|-----------|
| NPD-001 | Reuse first | A new composition or shared component seems necessary | Component-selection result from `RD-012` | A suitable HyperShell component or approved pattern is ignored |
| NPD-002 | Extend existing pattern | An existing pattern is close but incomplete | Existing pattern ID, missing capability, and extension decision | A competing variant is created for an intent the library already owns |
| NPD-003 | Search proof | Level 4 component selection is reached | Search terms and results from the pattern index, production components, shared packages, Storybook stories, and PatternFly 6 documentation | A gap is asserted without a recorded search |
| NPD-004 | Reusable intent | A new pattern is proposed | At least two concrete surfaces or one clearly cross-page product capability that cannot be served locally | The need is page-specific, speculative, or only avoids refactoring |
| NPD-005 | Product decision | PatternFly offers multiple options or no opinion, or HyperShell must compose a product-specific contract | Decision, rationale, and why PatternFly guidance alone is insufficient | A pattern records implementation convenience rather than a durable product decision |
| NPD-006 | Pattern contract | A candidate is proposed | User intent, use/not-use rules, decision, canonical components, states, accessibility, responsive behavior, terminology, integration boundaries, do/don't guidance, and related patterns | Any required contract field is missing |
| NPD-007 | Canonical example | A pattern is submitted for approval | Storybook story and deterministic fixtures covering the declared states | An approved pattern has no canonical example or state coverage |
| NPD-008 | Human review | A new or materially changed pattern is proposed | Fullsend human-review trigger, reviewer decision, and final status | A new pattern silently enters the library or becomes approved without review |
| NPD-009 | Library admission | A pattern document is added or changed | Pattern file, `index.yaml` entry, status, and checker result | The index and document disagree, or the pattern-library checker fails |
| NPD-010 | Replacement | An existing pattern is superseded | Superseded pattern, replacement, migration notes, and updated consumers | A superseded pattern remains in use or `replaces` is missing |
| NPD-011 | Consumer regression | A shared pattern changes | Consumer list and affected package checks | A consumer is not updated or checked |

## Admission workflow

1. Complete `RD-012` and prove levels 1 through 3 do not fit.
2. Search:
   - `specs/web-console/patterns/index.yaml`;
   - HyperShell production components;
   - shared UI packages;
   - existing Storybook stories;
   - relevant PatternFly 6 design and accessibility documentation.
3. Decide whether to extend an existing pattern. Extension is required when the
   existing pattern already owns the user intent.
4. If a genuine gap remains, write a candidate pattern contract.
5. Add one Markdown file under `specs/web-console/patterns/patterns/`.
6. Add or update the matching entry in `specs/web-console/patterns/index.yaml`.
7. Add a deterministic canonical Storybook example when the pattern is ready for
   approval.
8. Run:

   ```bash
   python3 skills/web-console/ui-change-flow/scripts/check_ui_pattern_library.py
   ```

9. Trigger human review through the Fullsend human-review gate.
10. Use `candidate` until the contract and example are complete and reviewed.
    Use `approved` only after human review confirms the reusable contract.

## Status rules

- **Candidate:** documented direction with an incomplete contract or no canonical
  example. It may guide discussion but is not the first choice in `RD-012`.
- **Approved:** complete contract, canonical Storybook example, and human review.
  New work must reuse it before creating a local composition.
- **Superseded:** retained for traceability only. New work must use its
  replacement and consumers must be migrated or explicitly scheduled.

## Placement rules

- Use `specs/web-console/patterns/foundations/` for product-wide rules and
  vocabulary.
- Use `specs/web-console/patterns/patterns/` for reusable compositions tied to a
  user intent.
- Do not create a separate skill, checklist, or local convention for a rule that
  belongs in the positive pattern library.

## Completion evidence

A new-pattern change is complete only when the implementation record contains:

- `RD-012` search ledger;
- `NPD-001` through `NPD-011` results;
- pattern ID and status;
- canonical story ID;
- checker result;
- consumer regression results;
- human-review trigger and outcome.
