---
id: application-shell
title: Application Shell
status: approved
story: HyperShell/Shell
tags: [shell, navigation, masthead, breadcrumb, sidebar]
components:
  - PatternFly Page
  - PatternFly Masthead
  - PatternFly PageSidebar
  - PatternFly Breadcrumb
  - PatternFly SkipToContent
---

# Application Shell

## When to use

Use for every authenticated web-console route.

## When not to use

Standalone login, print output, and embedded external consoles do not use this
shell.

## HyperShell decision

The shell owns the skip link, masthead, managed sidebar, route breadcrumbs, and
main content container. Pages own only their page header and body regions.

- The sidebar exposes Overview, Gateways, and Dashboard.
- The masthead exposes the color-scheme toggle and user menu.
- Gateway routes receive a breadcrumb back to the gateway collection.
- The main container has the stable `main-content` id used by the skip link.

## Canonical example

`HyperShell/Shell`

## Required states

- Authenticated.
- Route heading focus after navigation.
- Narrow viewport with managed sidebar.
- Loading gateway name for a detail breadcrumb.

## Accessibility

- Keep the skip link as the first meaningful shell control.
- Focus the route heading after navigation.
- Name the sidebar, breadcrumb, navigation toggle, color-scheme toggle, and user
  menu.
- Do not duplicate global navigation inside a page surface.

## Responsive behavior

- Use PatternFly's managed sidebar at narrow widths.
- Keep masthead controls within the masthead toolbar.

## Do

- Keep breadcrumbs in the shell rather than each page.
- Derive active navigation from the current route.
- Use route-owned providers for domain navigation and operations.

## Don't

- Add a page-level secondary global navigation.
- Recreate the masthead, user menu, or sidebar in a page component.
- Remove the skip link or main content id.

## Related

- `page-layout`
- `detail-page`
- `dashboard-page`

