# Web-console visual input

Use this reference when a task supplies a screenshot, visual reference, or mockup
for web-console UI work. It owns classification and normalization for the
canonical UI change flow.

## Required reading

- `specs/web-console/patterns/README.md`
- `specs/web-console/patterns/index.yaml`
- every pattern or foundation document selected from that index
- `skills/web-console/ui-change-flow/references/ui-conventions.md`
- relevant terminology, status vocabulary, routes, stories, and tests

## Classify first

Record one classification before implementation:

- **Tier 0 - cosmetic:** existing-component prop, text, token, or fixture change.
  Implement directly; no new mockup or visual comparison.
- **Tier 1 - normalized implementation:** existing patterns composed in a new
  way, including a materially different state or responsive behavior. Implement
  from the pattern library; create a production Storybook story and state
  coverage.
- **Tier 2 - pattern or structure risk:** new page or route, shared component,
  interaction flow, control order, page hierarchy, table/list/card/detail
  presentation, or materially changed stacking. Use an existing repository
  mockup when one fits; otherwise request or create a mockup only when the task
  includes mockup or spec work.

When signals conflict, choose the higher tier and explain why.

## Normalize every visual input

Before writing implementation code, produce a concise implementation record:

- classification and rationale;
- visible-element inventory grouped by page region and hierarchy;
- component reuse map for every visible element;
- data contract for every visible value, including type, source, empty value,
  and whether the image uses representative sample data;
- state contract: loading, empty, success, validation, error, partial failure,
  permission, and recovery where applicable;
- interaction, keyboard, screen-reader, and responsive behavior;
- layout contract, including grid columns, stacking order, alignment, density,
  and the primary action placement;
- terminology, status, icon, and semantic-color mapping;
- intentional deviations and their reason.

Open and inspect every supplied static image before producing the visible-element
inventory and component reuse map. If the current runtime cannot inspect the
image, record the capability limit and request a text inventory, DOM/story
description, or accessible interactive mockup. A component map based only on the
attachment filename or issue title is invalid.

When a supplied mockup uses a PatternFly component in a way that conflicts with
its documented purpose, select the semantically correct component for the user
outcome and record the deviation. The mockup is visual intent, not permission to
reproduce a component misuse.

Prefer an existing HyperShell component, then a PatternFly 6 component or
documented pattern, then a composition of PatternFly primitives. Create a new
shared component only after repository and PatternFly searches prove the gap.
Do not copy screenshot spacing, colors, typography, or icons into production.

## PatternFly and CSS rules

- Follow current PatternFly 6 design guidelines and the selected HyperShell
  pattern documents.
- Use PatternFly components, variants, and layout primitives before composing
  custom markup.
- Use PatternFly tokens and utilities before adding CSS.
- Use a CSS Module only for a documented gap that PatternFly and existing
  HyperShell components cannot cover. Keep it page-specific, tokenized, and
  minimal.
- Do not add arbitrary colors, spacing, typography, shadows, borders, or
  route-local wrappers when a PatternFly or shared component provides the
  behavior.
- Do not fork a PatternFly component solely to restyle it.

## Screenshot capture contract

A screenshot is buildable only when its context is recorded with it. When
creating or accepting a screenshot, record:

- route or screen name and user role;
- Storybook story or fixture name, when the image came from a repository story;
- exact state, such as loaded, empty, loading, error, partial, or restricted;
- viewport, orientation, browser zoom, theme, locale, and direction;
- whether the image is full-page or viewport-only, and which regions are cropped;
- pointer, focus, selection, expanded, filtering, sorting, and pagination state;
- the visual-input source and whether it is authoritative, exploratory, or
  AI-generated.

Do not infer unseen behavior from pixels. Ask for the missing contract when a
visual choice materially changes implementation.

## Creating a static mockup image

Use this workflow when an agent must compose a new static visual mockup rather
than capture an existing rendered UI. The image is exploratory design input,
not a production implementation contract.

Before generating the image, prepare a visual brief containing:

- purpose, user role, route or screen name, and primary task;
- the exact visible text, including title, labels, buttons, statuses, and help
  text;
- state, sample data, permissions, and empty or unavailable values;
- page regions and hierarchy from top to bottom;
- component reuse map using HyperShell and PatternFly 6 components;
- layout, grid, spacing density, alignment, and primary action placement;
- responsive target, normally desktop `1440x900`; request a second narrow
  `390x844` image when stacking changes the design;
- semantic colors, status icons, typography, focus target, and locale;
- intentional deviations from the pattern library.

When generating the bitmap, use the repository `imagegen` skill and prompt for
a clean, flat, high-contrast PatternFly 6 web-console mockup. Require exact
text, realistic UI density, accessible contrast, and no decorative imagery,
brand ambiguity, photorealism, placeholders such as lorem ipsum, or invented
controls.

After generation:

1. Inspect the image against the visual brief and the selected patterns.
2. Correct text, hierarchy, component choice, status treatment, or layout drift
   before sharing it.
3. Return the image with the complete screenshot capture contract and the
   visual brief.
4. Label the result `AI-generated static mockup - exploratory`.
5. Do not commit the bitmap or treat it as authoritative. Before production
   implementation, normalize it into a written spec and, for Tier 2 work, an
   interactive repository mockup.

If the user wants deterministic, reviewable UI instead of an exploratory image,
create or extend the interactive Storybook mockup rather than generating a
bitmap.

## Screenshot and mockup handling

- Treat a screenshot as intent evidence, not implementation law.
- Do not commit screenshots, HAR files, or generated parity artifacts.
- Do not create a screenshot archive or expand app-wide mockup coverage as part
  of a normal implementation task.
- Reuse or extend the closest existing mockup instead of creating a competing
  variant.
- Keep mockups deterministic and independent of production imports and live
  services.
- A Tier 2 implementation requires equivalent mockup and production Storybook
  state names when repository policy invokes the parity gate.

## Completion checks

Run the checks required by the classification. At minimum:

- changed mockup TSX/CSS through `check_mockup_patternfly.py`;
- `make check-forbidden-dom-injection` for browser UI changes;
- relevant unit, type, lint, formatting, Storybook, and interaction tests;
- `skills/build/ui-build-gate/SKILL.md` when current repository policy requires
  mockup-to-production parity.

When visual comparison is skipped because no comparison is required or the user
explicitly disabled it, state that no screenshot comparison was performed. Do
not fabricate parity evidence.
