---
id: responsive-behavior
title: Responsive Behavior
status: approved
tags: [responsive, breakpoints, narrow]
---

# Responsive Behavior

## When to use

Use for every page, table, form, dashboard, modal, and toolbar. This is
especially important when converting a desktop screenshot into production UI.

## HyperShell decision

PatternFly components provide responsive behavior, but HyperShell must define
how page-owned regions stack and how dense data becomes usable at narrow
widths.

- Keep page header above body content.
- Stack page sections in source order at narrow widths.
- Preserve the primary action; secondary actions may collapse into approved
  menus.
- Keep modals within the viewport and avoid horizontal scrolling.
- Use PatternFly responsive props and utilities before custom CSS.
- Move row actions to the approved kebab menu rather than leaving many visible
  buttons.

## Canonical examples

- `Mockups/Gateways/Gateway list`
- `Mockups/Gateways/Provision gateway`
- `Mockups/Dashboards/Operational dashboard`

## Required states

Responsive behavior must be defined for loaded, empty, and error states. An
error layout cannot introduce horizontal overflow.

## Accessibility

- Maintain visible focus and logical focus order after reflow.
- Preserve accessible names when controls collapse into menus.
- Do not trap focus in a modal that cannot fit the viewport.
- Do not remove a control solely because the viewport is narrow.

## Do

- Design the narrow layout as a first-class state.
- Use PatternFly grid, flex, stack, and table responsive behavior.
- Keep the primary action visible where the user needs it.

## Don't

- Rely only on browser zoom or horizontal scrolling.
- Hide required information or recovery actions at narrow widths.
- Add page-specific CSS before exhausting PatternFly props and utilities.

## Related

- `page-layout`
- `collection-table`
- `dashboard-section`

