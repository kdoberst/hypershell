# Rules and Design Checks

## Purpose

This file routes UI work to the authoritative HyperShell pattern documents and
records the result with stable check IDs. It intentionally does not duplicate
pattern rules. The pattern library owns product-specific design decisions; this
catalog owns check selection and evidence.

Checks are selected by changed surface, not by UI tier. The tier records
human-review risk only.

## Check contract

For every applicable row:

1. Read every document named in `Authoritative source`.
2. Apply the pattern unless the owning spec documents an exception.
3. Record the check ID, result, evidence, and any intentional deviation.

| ID | Run when | Authoritative source | Evidence | Fail when |
|----|----------|----------------------|----------|-----------|
| RD-001 | Any UI-bearing change | `specs/web-console/patterns/index.yaml` plus every selected foundation or pattern | Pattern IDs selected and search decision | An applicable pattern is ignored or a competing variant is created without evidence |
| RD-002 | Visible text, labels, actions, errors, or empty states change | `foundations/terminology.md` | Terminology decision for changed text | Product terminology is inconsistent |
| RD-003 | Visible values, dates, counts, identifiers, endpoints, commands, or fixtures change | `foundations/content-and-data.md` | Data and formatting contract | Values, empty states, dates, or fixture data do not follow the foundation |
| RD-004 | Status, health, severity, progress, or semantic color changes | `foundations/status-vocabulary.md` and `foundations/icon-status-tokens.md` | Status-to-appearance mapping | Status is rendered outside the shared contract or uses an ad hoc icon, token, or label |
| RD-005 | A full page, page hierarchy, section treatment, or page-owned navigation changes | `foundations/page-layout.md` | Page-region and body-treatment decision | Page structure, background, cards, or breadcrumbs violate the pattern |
| RD-006 | A page, table, form, dashboard, modal, toolbar, or stacking behavior changes | `foundations/responsive-behavior.md` | Narrow-viewport behavior and primary-action decision | Narrow behavior is undefined, relies on horizontal scrolling, or removes required information |
| RD-007 | Any stateful page, component, or data-backed control changes | `foundations/state-coverage.md` | Applicable-state list and Storybook coverage | A required loading, empty, error, permission, validation, partial-failure, or recovery state is missing |
| RD-008 | A collection, table, list, toolbar, pagination, sorting, or row-action surface changes | `patterns/collection-table.md` and `patterns/filter-toolbar.md` when filtering applies | Component and interaction decisions | Table, pagination, sorting, toolbar, or row-action behavior differs from the pattern |
| RD-009 | A destructive or irreversible action changes | `patterns/destructive-action.md` | Confirmation and danger-treatment decision | The action lacks the required confirmation or danger treatment |
| RD-010 | An empty, error, permission, or recovery state changes | The matching `empty-state`, `error-recovery`, or `permission-gate` pattern | State treatment and recovery decision | The state is generic, unrecoverable, or replaces useful page context unnecessarily |
| RD-011 | A detail page, tab section, dashboard, form, command, operation result, or status chart changes | The matching pattern selected from `index.yaml` | Pattern ID and composition decision | The implementation deviates from the selected pattern without an owning-spec exception |

## Cross-cutting technical checks

These rules are not owned by a visual pattern and remain in this catalog.

### RD-012 - Component selection order

- **Run when:** any UI composition changes.
- **Check:** apply this order without skipping a level:
  1. Use an existing HyperShell component or approved pattern.
  2. If none fits, use a PatternFly 6 component or documented PatternFly
     pattern.
  3. If no single PatternFly component fits, compose PatternFly primitives.
  4. Create a new shared component only when repository and PatternFly searches
     prove a real gap and the need extends beyond the current page.
- **Evidence:** selected level; search terms; candidates found; why each earlier
  level does not fit; and, for level 4, the reusable need and proposed contract.
- **Fail when:** a local implementation replaces a suitable shared component, a
  search level is skipped, or a new shared component is created without recorded
  search evidence.

### RD-013 - Token and custom-CSS admission

- **Run when:** spacing, typography, color, borders, shadows, sizing, or layout
  styling changes.
- **Check:** use PatternFly props, tokens, utilities, and responsive primitives
  first. Admit custom CSS only for a documented capability gap.
- **Evidence:** PatternFly options considered and any CSS-gap rationale.
- **Fail when:** custom styling replaces a suitable PatternFly primitive.

### RD-014 - New pattern admission

- **Run when:** a new shared component or reusable pattern is proposed.
- **Check:** follow `catalog/new-pattern-determination.md`.
- **Evidence:** `NPD-*` results recorded by that workflow.
- **Fail when:** a new pattern bypasses the determination workflow or human
  review.

### RD-015 - Presentation boundary

- **Run when:** production React view or shared UI code changes.
- **Check:** keep live data, routing, session, API, generated SDK, telemetry,
  and infrastructure effects outside the presentation view.
- **Evidence:** hook, port, adapter, or application service that owns each
  external effect.
- **Fail when:** presentation code directly performs an external effect.

### RD-016 - Forbidden DOM injection

- **Run when:** any browser source, Storybook story, or mockup changes.
- **Check:** render React elements or use an approved parser returning React
  elements. Run `make check-forbidden-dom-injection`.
- **Evidence:** command result.
- **Fail when:** raw HTML or an equivalent injection sink is used.

### RD-017 - Deviation authority

- **Run when:** implementation differs from a selected pattern, visual input, or
  written spec.
- **Check:** record the difference, reason, authority, and human-review
  consequence. Update the owning spec when the difference establishes durable
  behavior.
- **Evidence:** deviation ledger.
- **Fail when:** a deviation is silent or is justified only by visual preference.

### RD-018 - PatternFly design and accessibility guidance

- **Run when:** a PatternFly 6 component, variant, layout, or composition is
  selected or materially changed.
- **Check:** read the current PatternFly 6 design guidelines and accessibility
  guidance for every selected component. Follow the documented use cases,
  content rules, placement, variant guidance, required structure, and
  accessibility behavior.
- **Evidence:** component names; guidance documents read; and the resulting
  variant, prop, content, structure, and accessibility decisions.
- **Fail when:** a component is used outside its documented guidance, required
  child structure is omitted, a variant is chosen only for styling, or
  accessibility guidance is not applied.

## Pattern-library precedence

Owning feature specs are authoritative for page-specific behavior. Pattern
documents are authoritative for reusable HyperShell composition. PatternFly is
authoritative for component behavior and accessibility implementation. When
these conflict, resolve the conflict in the owning spec before completing the
change; do not choose one source silently.
