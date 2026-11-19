# HyperShell UI Positive Pattern Library

This library records HyperShell decisions where PatternFly offers multiple
options, no opinion, or needs product-specific composition. It is a positive
library: patterns point agents and reviewers to an approved example to start
from rather than requiring them to infer the right result from prose alone.

## Relationship to other UI guidance

- `skills/web-console/ui-change-flow/references/checks/rules-and-design.md` routes
  changes to these foundations and owns cross-cutting technical checks.
- This library is the canonical catalog of reusable HyperShell compositions.
  When a foundation and a pattern overlap, the pattern is more specific and
  should be followed for that use case.
- PatternFly documentation remains authoritative for component behavior and
  accessibility implementation. This library records HyperShell's chosen
  composition, state contract, and terminology on top of PatternFly.
- Interactive Storybook examples are required for `approved` patterns. A rule
  without a working example is `candidate`, not an approved pattern.

## Directory layout

```text
foundations/  Product-wide rules and vocabulary
patterns/     Reusable compositions for a specific UI intent
index.yaml    Machine-readable catalog used by agents and checkers
```

## Pattern status

- `candidate`: documented direction without a complete canonical example.
- `approved`: has a canonical Storybook example and a complete state contract.
- `superseded`: retained for traceability; use `replaces` to identify the
  successor. Do not use superseded patterns in new work.

## Required pattern contract

Every pattern must define:

- the user intent it serves;
- when to use and not use it;
- the HyperShell decision and rationale;
- canonical PatternFly or HyperShell components;
- required states;
- accessibility requirements;
- responsive behavior;
- terminology and status rules;
- a canonical Storybook example;
- do and don't guidance;
- related patterns.

## Agent workflow

1. Search `index.yaml` by intent, tags, and applicable surfaces.
2. Read the selected foundation and pattern documents.
3. Open the canonical Storybook example.
4. Reuse the pattern unless a documented exception applies.
5. Extend an existing pattern when it is close rather than creating a competing
   pattern.
6. Record any intentional deviation in the owning spec or implementation
   record.

## Adding a pattern

Add one Markdown file per pattern. Do not create a competing variant for the
same intent. If a new solution is necessary, either extend the existing pattern
or mark it `superseded` and identify the replacement.

Update `index.yaml` in the same change. Run:

```bash
python3 skills/web-console/ui-change-flow/scripts/check_ui_pattern_library.py
```

