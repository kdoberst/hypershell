---
id: filter-toolbar
title: Filter and Bulk Action Toolbar
status: approved
story: Mockups/Gateways/Gateway list
tags: [toolbar, filters, search, bulk-actions]
components:
  - PatternFly Toolbar
  - PatternFly SearchInput
  - PatternFly MenuToggle
  - PatternFly Button
---

# Filter and Bulk Action Toolbar

## When to use

Use above a collection when users need to search, filter, compare, select, or
perform bulk operations.

## When not to use

- Use a page-level action area when there is no collection filtering.
- Use dashboard filters when the intent is to scope widgets rather than table
  rows.

## HyperShell decision

Use one PatternFly toolbar above the collection. Keep search, filters, result
count, and bulk actions in consistent groups. Bulk controls appear only after
selection and clearly identify affected objects.

## Canonical example

`Mockups/Gateways/Gateway list`

## Required states

- No selection.
- Selection active.
- Bulk confirmation.
- Bulk partial failure.
- Filtered empty result.
- Filter error where filter state cannot be resolved.

## Accessibility

- Name every filter and action control.
- Announce selection count and affected result count.
- Keep focus on the control that opened a filter or bulk menu after it closes.
- Provide a clear way to clear filters and selections.

## Responsive behavior

- Collapse secondary filters and actions into approved menus.
- Keep search visible when it is the primary way to find resources.
- Keep the selected-count and primary bulk action available.

## Do

- Preserve filters while pagination changes.
- Show the active filter count or visible filter chips.
- Disable unavailable bulk actions with an explanatory reason.

## Don't

- Show bulk actions before anything is selected.
- Use different filter terminology than the owning data model.
- Hide the selected count during a bulk operation.

## Related

- `collection-table`
- `destructive-action`
- `error-recovery`

