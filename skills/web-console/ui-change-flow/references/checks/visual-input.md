# Visual Input Checks

## Purpose

This file defines how HyperShell web-console work consumes screenshots, static
visual references, AI-generated mockups, interactive Storybook mockups, and
existing production UI. Visual input is intent evidence, not implementation law.

The UI tier records human-review risk. It does not determine which checks run.
Check selection is based on the changed surface and the visual-input contract.

Every check has a stable `VI-*` ID. Implementation records and pull-request
evidence must reference these IDs rather than copying the full check text.

## Input classification

Record a human-review risk tier before implementation:

- **Tier 0 - routine:** existing-component prop, text, token, or fixture change.
  Human review is not required unless an explicit trigger occurs.
- **Tier 1 - normalized:** a new composition using approved patterns,
  components, terminology, and interaction conventions. Human review is not
  required when the implementation stays within those contracts.
- **Tier 2 - judgment:** new page, navigation, cross-page change, shared
  component or pattern, material responsive change, or any deviation from an
  established pattern. Human review is required by default.

When signals conflict, choose the higher tier and explain why.

## Visual-input normalization

### VI-001 - Input provenance

- **Applies to:** every screenshot, visual reference, static mockup, interactive
  mockup, or production UI used as input.
- **Check:** record the source, authority level, and relationship to the work
  item. Classify it as authoritative, exploratory, AI-generated, or an existing
  implementation surface.
- **Evidence:** provenance statement in the implementation record.
- **Fail when:** provenance is unknown, an exploratory image is treated as
  authoritative, or an AI-generated bitmap is presented as reviewed design.

### VI-002 - Visual contract completeness

- **Applies to:** every visual input that materially affects implementation.
- **Check:** record enough context to distinguish observed appearance from
  required behavior. Ask for missing contract information when a visual choice
  materially changes implementation.
- **Evidence:** route or screen, role, state, source story or fixture, viewport,
  theme, locale, direction, and visible interaction state where applicable.
- **Fail when:** behavior, state, permissions, or responsive intent is inferred
  solely from pixels.

### VI-003 - Visible-element inventory

- **Applies to:** a page, section, table, card, detail view, navigation area, or
  materially changed composition.
- **Check:** inventory visible elements grouped by page region and hierarchy.
- **Evidence:** region hierarchy and element inventory.
- **Fail when:** the implementation adds, removes, merges, or reorders visible
  content without a spec or recorded intentional-deviation reason.

### VI-004 - Component reuse map

- **Applies to:** every visible element or interaction represented by the visual
  input.
- **Check:** map each element to an existing HyperShell component, approved
  pattern, PatternFly 6 component, or documented composition. Record the search
  evidence before proposing a new shared component.
- **Evidence:** component map and search decisions.
- **Fail when:** production markup is copied from the image instead of mapped to
  the component system, or a new component is proposed without a proven gap.

### VI-005 - Data contract

- **Applies to:** every visible value, label, count, status, timestamp, avatar,
  chart, empty state, or sample-data element.
- **Check:** record value type, source, units, formatting, empty value, loading
  value, permission behavior, and whether the visual input uses representative
  sample data.
- **Evidence:** data contract for changed visible values.
- **Fail when:** representative image data is hardcoded as production behavior or
  a value's source, type, formatting, or empty state is unknown.

### VI-006 - State contract

- **Applies to:** stateful UI, data views, forms, workflows, controls, and async
  actions.
- **Check:** identify loading, empty, success, validation, error, partial
  failure, permission, and recovery states where applicable.
- **Evidence:** required state list and production Storybook state coverage.
- **Fail when:** only the successful populated state is implemented or a required
  failure, empty, loading, or permission path is missing.

### VI-007 - Interaction contract

- **Applies to:** controls, forms, menus, tables, navigation, workflows, and any
  element that responds to user action.
- **Check:** record pointer, keyboard, focus, selection, expansion, filtering,
  sorting, pagination, and recovery behavior where applicable.
- **Evidence:** interaction and keyboard paths for changed controls.
- **Fail when:** interaction behavior is inferred only from a static image or a
  visible control has no defined activation behavior.

### VI-008 - Layout and responsive contract

- **Applies to:** page layout, grids, cards, tables, lists, detail views,
  navigation, stacking, alignment, density, and primary-action placement.
- **Check:** record layout hierarchy, alignment, density, grid or stacking
  behavior, and narrow-viewport treatment where applicable.
- **Evidence:** layout contract and responsive decision.
- **Fail when:** spacing or stacking is copied from pixels without a component or
  token decision, or a material responsive behavior is undefined.

### VI-009 - Terminology and status mapping

- **Applies to:** visible text, labels, actions, help text, statuses, icons, and
  semantic colors.
- **Check:** map visual vocabulary to the product terminology contract and map
  each status to the approved icon, PatternFly status prop, semantic token,
  generated class, and label.
- **Evidence:** terminology and status mapping table.
- **Fail when:** image text, icon, or color overrides product terminology or the
  approved status mapping.

### VI-010 - Intentional deviations

- **Applies to:** any difference between visual input, written spec, pattern
  library, or final implementation.
- **Check:** record each intentional deviation, reason, authority, and the
  human-review consequence.
- **Evidence:** deviation ledger.
- **Fail when:** production silently improves, reinterprets, or contradicts the
  input without recording the decision.

## Screenshot capture contract

A screenshot is buildable evidence only when its context is recorded with it.
When creating or accepting a screenshot, record:

- route or screen name and user role;
- Storybook story or fixture name, when the image came from a repository story;
- exact state, such as loaded, empty, loading, error, partial, or restricted;
- viewport, orientation, browser zoom, theme, locale, and direction;
- full-page or viewport-only capture and any cropped regions;
- pointer, focus, selection, expanded, filtering, sorting, and pagination state;
- source and authority level.

Do not infer unseen behavior from pixels.

## Static AI mockup workflow

Use this workflow only when an agent must compose a new exploratory static
mockup and deterministic Storybook output is not the requested deliverable. A
static bitmap is exploratory input, not a production implementation contract.

Before generating the image, prepare a visual brief containing:

- purpose, user role, route or screen name, and primary task;
- exact visible text, including title, labels, buttons, statuses, and help text;
- state, sample data, permissions, and empty or unavailable values;
- page regions and hierarchy from top to bottom;
- component reuse map using HyperShell and PatternFly 6 components;
- layout, grid, spacing density, alignment, and primary action placement;
- responsive target, normally desktop `1440x900`; request a second narrow
  `390x844` image when stacking changes the design;
- semantic colors, status icons, typography, focus target, and locale;
- intentional deviations from the pattern library.

When generating the bitmap, use the repository `imagegen` skill and require:

- clean, flat, high-contrast PatternFly 6 web-console styling;
- exact text and realistic UI density;
- accessible contrast;
- no decorative imagery, brand ambiguity, photorealism, lorem ipsum, or invented
  controls.

After generation:

1. Inspect the image against the visual brief and selected patterns.
2. Correct text, hierarchy, component choice, status treatment, or layout drift
   before sharing it.
3. Return the image with the screenshot capture contract and visual brief.
4. Label the result `AI-generated static mockup - exploratory`.
5. Do not commit the bitmap or treat it as authoritative.

If the user wants deterministic, reviewable UI, create or extend an interactive
Storybook mockup rather than generating a bitmap.

### VI-011 - Static mockup inspection

- **Applies to:** every AI-generated or externally supplied static mockup.
- **Check:** inspect the image against the visual brief, selected patterns,
  terminology, status mapping, hierarchy, and responsive target before sharing
  or implementing from it.
- **Evidence:** inspection result and corrections made.
- **Fail when:** a generated image is shared without inspection or contains text,
  hierarchy, status, component, or layout drift.

## Artifact handling

### VI-012 - Transient visual artifacts

- **Applies to:** screenshots, HAR files, generated bitmaps, and parity output.
- **Check:** keep visual artifacts transient and do not commit them unless an
  owning repository policy explicitly requires committed evidence.
- **Evidence:** artifact handling statement.
- **Fail when:** screenshots, HAR files, generated bitmaps, or parity artifacts
  are committed without an explicit policy exception.

### VI-013 - Mockup reuse

- **Applies to:** work that uses or creates a repository mockup.
- **Check:** reuse or extend the closest existing mockup instead of creating a
  competing variant. Keep mockups deterministic and independent of production
  imports and live services.
- **Evidence:** selected mockup and any extension decision.
- **Fail when:** a new competing mockup is created without a documented reason or
  a mockup depends on production code or live services.

## Source migration

This file consolidates the durable content from
the former visual-input skill. That skill is a migration source only and is not
a runtime dependency of this catalog.
