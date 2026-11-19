---
id: page-layout
title: Page Layout
status: approved
tags: [layout, page, breadcrumbs]
---

# Page Layout

## When to use

Use for every new full-page web-console surface or material change to page
hierarchy, section treatment, or page-owned navigation.

## HyperShell decision

PatternFly supports several page-section and card combinations. HyperShell
chooses a two-region page surface:

1. A default page header region owns the visible title, description, and
   page-level actions.
2. A following body region owns page content.

For a resource detail page, use the default white body treatment. For a
collection, provisioning workflow, or multi-section dashboard, use the secondary
body treatment; cards, forms, tables, and toolbars provide the white working
surfaces within it.

For a page with multiple distinct content sections, such as a landing page or
dashboard, use the secondary body treatment and group each section in cards.
The result is a gray page background with white card surfaces.

Use breadcrumbs as the primary navigation when a page moves deeper into a
section. The parent breadcrumb links to the collection or parent page.

## Canonical components

- PatternFly `PageSection`
- PatternFly `Page`
- PatternFly `Breadcrumb`
- PatternFly `Card`
- HyperShell page surfaces and shared shell components

## Canonical examples

- `Mockups/Gateways/Gateway list`
- `Mockups/Gateways/Gateway detail`
- `Mockups/Gateways/Provision gateway`
- `Mockups/Homepage`
- `Mockups/Dashboards/Operational dashboard`

## Required states

The page layout must remain structurally valid in loading, empty, error, and
permission-limited states. Do not replace the whole page with a state that
removes expected navigation.

## Accessibility

- Use one visible page-level `h1`.
- Keep page title, description, and primary action in the page header.
- Preserve focus and breadcrumb navigation when content state changes.
- Do not put global shell chrome inside a page-owned parity component.

## Responsive behavior

- Keep the page header above the body.
- Stack page sections and cards at narrow widths.
- Preserve breadcrumb visibility or provide the approved responsive navigation
  behavior.

## Do

- Use PatternFly layout props and utilities before custom CSS.
- Use cards to represent distinct sections on secondary-background pages.
- Keep page-owned content separate from shared shell chrome.

## Don't

- Put gray-backed content directly on a gray body.
- Add cards only to compensate for a secondary background.
- Recreate the shell, masthead, global navigation, or user controls in a page.

## Related

- `collection-table`
- `detail-page`
- `dashboard-section`

