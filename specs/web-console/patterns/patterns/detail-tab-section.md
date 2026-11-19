---
id: detail-tab-section
title: Detail Tab Section
status: approved
story: Production/Gateways/Gateway detail
tags: [tabs, section, collection, detail]
components:
  - PatternFly Tabs
  - PatternFly Title
  - ResourceTable
  - ResourceRefreshButton
---

# Detail Tab Section

## When to use

Use for a major section inside a resource detail page, especially a collection
related to the parent resource.

## When not to use

Use `detail-page` for the overall page and `collection-table` for a top-level
collection.

## HyperShell decision

A tab section begins with a section heading, concise description, and refresh
action. Permission notices, operation errors, load errors, and loading state
appear before the collection. The collection uses the shared `ResourceTable`.

Tabs mount only while active, preserving query behavior and transient state.
The active tab is represented in the URL.

## Canonical example

`Production/Gateways/Gateway detail`

## Required states

- Active tab.
- Inactive tab.
- Loading.
- Loaded.
- Permission limited.
- Action error.
- Load error with retry.
- Empty and filtered-empty collection.

## Accessibility

- Use PatternFly tab semantics and an accessible tab list label.
- Keep the section heading associated with its content.
- Return focus appropriately after closing a dialog opened from the section.
- Preserve collection control labels.

## Responsive behavior

- Wrap or scroll tabs according to PatternFly.
- Stack section heading, refresh, notices, and table.

## Do

- Query only when the tab is active.
- Keep parent-resource context in the section heading and actions.
- Use shared collection components.

## Don't

- Mount and query every tab simultaneously.
- Duplicate page-level headings inside each tab.
- Replace only the table on error while hiding the section controls.

## Related

- `detail-page`
- `collection-table`
- `filter-toolbar`

