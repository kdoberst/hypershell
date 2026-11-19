---
id: detail-page
title: Resource Detail Page
status: approved
story: Mockups/Gateways/Gateway detail
tags: [detail, navigation, sections]
components:
  - PatternFly PageSection
  - PatternFly Breadcrumb
  - PatternFly DescriptionList
  - PatternFly Card
---

# Resource Detail Page

## When to use

Use when the user needs to inspect one resource and understand its
configuration, status, relationships, and available actions.

## When not to use

- Use `collection-table` when comparison across resources is primary.
- Use a modal for lightweight confirmation, not full resource inspection.

## HyperShell decision

Use breadcrumbs as the primary navigation into a detail page. The parent
breadcrumb returns to the collection. Use the page header for the resource
name, concise purpose, and primary action. Use the default white body treatment
for a single primary content type.

Group information into stable, labeled sections. Use `DescriptionList` for
key-value configuration and shared components for status and actions.

## Canonical example

`Mockups/Gateways/Gateway detail`

## Required states

- Loaded.
- Loading.
- Not found.
- Permission limited.
- Error.
- Related-resource partial failure.
- Destructive confirmation.

## Accessibility

- Use the resource name as the page-level heading.
- Keep breadcrumb order stable and logically ordered.
- Associate each section with its visible heading.
- Keep primary action names specific to the resource.

## Responsive behavior

- Stack sections in source order.
- Keep breadcrumbs available.
- Preserve key identification fields before secondary metadata.

## Do

- Show values users need for the next decision.
- Use explicit unknown values for unavailable fields.
- Link to related resources when the user can navigate to them.

## Don't

- Duplicate every table column without a task reason.
- Bury destructive actions in unrelated prose.
- Create a route-local metadata component when a shared one exists.

## Related

- `page-layout`
- `status-vocabulary`
- `destructive-action`

