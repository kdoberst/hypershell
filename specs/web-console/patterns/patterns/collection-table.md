---
id: collection-table
title: Collection Table
status: approved
story: Mockups/Gateways/Gateway list
tags: [table, collection, list, pagination, sorting]
components:
  - PatternFly Table
  - PatternFly Toolbar
  - PatternFly Pagination
  - PatternFly Dropdown
  - Shared HealthStatus
---

# Collection Table

## When to use

Use for a searchable, sortable collection of homogeneous resources where users
need to compare fields and take row-level actions.

## When not to use

- Use `dashboard-section` for summary or trend views.
- Use `detail-page` when the primary task is inspecting one resource.
- Use a simple list when columns, sorting, and comparison are unnecessary.

## HyperShell decision

PatternFly permits compact and default table variants. The approved gateway
list implementation and mockup use the compact table variant. New resource
collections should use the shared `ResourceTable` component so compact spacing,
toolbar behavior, pagination, empty states, and action placement stay constant.

- Enable sorting on every column unless sorting is technically impossible or
  the data set is very small.
- Show active sort direction only on the currently sorted column.
- Put row actions in an unlabeled final action column using the PatternFly
  action-cell and kebab-menu pattern.
- Mark external row actions with `isExternalLink` and the actual destination
  URL.
- When pagination is required, render controls above and below the table with
  shared state and page-size options.
- Place the collection surface on the secondary page body. The table and toolbar
  form the page's primary working surface, but the secondary background frames
  the collection as a distinct list surface.

## Canonical example

`Mockups/Gateways/Gateway list`

## Required states

- Loaded with realistic rows.
- Empty after filters and no resources exist.
- Initial empty collection.
- Loading.
- Error.
- Partial failure for bulk operations.
- Permission-limited actions.

## Accessibility

- Provide an accessible name for each row action menu, including the row object.
- Maintain table semantics and header association.
- Keep sort state perceivable to assistive technology.
- Keep pagination and filter controls labeled.

## Responsive behavior

- Preserve the columns needed for identification and the primary next action.
- Collapse row actions into the kebab menu.
- Avoid horizontal scrolling unless no responsive table treatment can preserve
  required meaning.

## Do

- Use realistic deterministic rows.
- Keep status treatment consistent with `status-vocabulary`.
- Use shared bulk-action components when available.
- Keep the primary create action in the page or toolbar location defined by the
  flow.

## Don't

- Add a visible action button per action per row.
- Create a route-local status component.
- Recreate the table without the shared `ResourceTable` component.
- Show pagination in only one location on a paginated table.

## Related

- `filter-toolbar`
- `destructive-action`
- `status-vocabulary`

