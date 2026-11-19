# Accessibility Checks

## Purpose

These checks establish WCAG 2.2 Level A and AA as the minimum accessibility
baseline for changed HyperShell UI. Automated scanning is useful but never
sufficient. Accessibility evidence must cover the actual route, component,
state, viewport, theme, and assistive-technology interaction.

Checks are selected by changed surface, not by UI tier.

## Check contract

| ID | Check | Run when | Evidence | Fail when |
|----|-------|----------|----------|-----------|
| A11Y-001 | Conformance scope | Any UI-bearing change | Routes, components, states, viewports, themes, tools, exclusions, and WCAG 2.2 A/AA result | The claim cannot identify what was evaluated or treats `NOT_TESTED` or a scanner non-finding as a pass |
| A11Y-002 | Semantic structure | Content, headings, landmarks, tables, groups, forms, or controls change | Accessibility-tree result for name, role, value, state, relationships, reading order, and headings | Semantics are missing, contradictory, or do not match the visible interface |
| A11Y-003 | Native semantics and ARIA | A control or widget changes | Component implementation and applicable PatternFly or WAI-ARIA Authoring Practices guidance | A custom widget replaces suitable native or PatternFly semantics or violates its documented keyboard/announcement pattern |
| A11Y-004 | Keyboard operability | Any interactive function changes | Keyboard path through every applicable state, including disabled, loading, error, overlay, and success | A function cannot be operated, focus is trapped, or required shortcuts are undocumented |
| A11Y-005 | Focus order and visibility | Navigation, route, overlay, form, table, or state transition changes | Focus entry, order, visibility, persistence, and restoration | Focus order destroys meaning, focus is invisible or obscured, or focus is moved or lost unexpectedly |
| A11Y-006 | Text alternatives | Images, icons, charts, media, or non-text meaning change | Alternative or equivalent text and its programmatic association | Meaningful non-text content has no equivalent, or decorative content is exposed incorrectly |
| A11Y-007 | Multiple modalities | Color, shape, location, sound, motion, hover, or gesture communicates meaning | The additional text, icon, control, or alternative modality | Meaning depends on only one sensory characteristic or complex gesture |
| A11Y-008 | Contrast | Text, icon, border, status, focus, chart, image, background, or theme treatment changes | Rendered contrast measurements for each changed state and theme | Normal text is below 4.5:1, large text below 3:1, or required non-text meaning below 3:1 without a WCAG exception |
| A11Y-009 | Resize and reflow | Layout, dense content, tables, forms, dashboards, or responsive behavior changes | 200% text resize and 400% zoom/reflow result, including text-spacing overrides | Content or function is lost, clips meaning, or introduces unintended two-dimensional scrolling |
| A11Y-010 | Orientation and preferences | Layout, motion, autoplay, updating content, or device behavior changes | Portrait/landscape, reduced-motion, forced/high-contrast, and applicable preference results | A supported orientation or preference removes content or function without an essential exception |
| A11Y-011 | Pointer and target size | Controls, touch targets, crowded actions, drag, or gesture behavior change | Measured target size/spacing and pointer, touch, keyboard, and voice paths where applicable | Targets are below 24 by 24 CSS pixels without a WCAG exception, or drag/gesture behavior has no single-pointer alternative |
| A11Y-012 | Time, motion, and flashing | Time limits, moving content, auto-updates, motion activation, or animation change | Adjustment, pause/stop/hide, reduced-motion, and flash-threshold result | Users cannot control qualifying time, motion, or updating content, or flash thresholds are violated |
| A11Y-013 | Errors and status | Validation, API failure, permission, authentication, async status, or recovery changes | Text identification, field association, correction suggestion, and announcement result | Errors or status messages are color-only, unidentified, disconnected, unannounced, or move focus unexpectedly |
| A11Y-014 | Forms and authentication | Fields, validation, authentication, password, or repeated data entry change | Labels, instructions, autocomplete purpose, error summary, correction, and password-manager result | Labels or purposes are missing, valid work is lost, errors interrupt valid input, or authentication imposes an unsupported cognitive test |
| A11Y-015 | Assistive-technology journey | A critical task, workflow, route, or stateful component changes | Complete task result with a representative screen reader and relevant input method | The task cannot be completed, state changes are not understandable, or announcements are missing, late, or misleading |
| A11Y-016 | Disabled-user evaluation | A materially changed critical workflow or accessibility-risk feature | Evaluation protocol, participant criteria, tasks, findings, and limitations | A formative review is presented as conformance, or a known critical barrier remains unresolved |

## Required practices

- Prefer native HTML semantics, then PatternFly components, then a documented
  WAI-ARIA pattern. Do not add ARIA to repair avoidable semantic mistakes.
- The accessible name must contain the visible label.
- Do not disable outlines or replace focus indicators without an equivalent
  visible treatment.
- Do not infer contrast from design tokens; measure the rendered result.
- Do not infer screen-reader behavior from markup alone; exercise the composed
  journey.
- Record tool names and versions when automated checks are used.
- Retest fixes in the composed route and state where the finding occurred.

## Source

WCAG 2.2 Level A and AA is the normative baseline. PatternFly accessibility
guidance and the WAI-ARIA Authoring Practices govern component-specific
implementation where applicable. Owning feature specs may add requirements but
may not reduce this baseline.
