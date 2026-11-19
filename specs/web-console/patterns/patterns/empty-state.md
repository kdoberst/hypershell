---
id: empty-state
title: Empty State
status: approved
story: Mockups/Gateways/Gateway list
tags: [empty, onboarding, next-action]
components:
  - PatternFly EmptyState
  - PatternFly Button
  - PatternFly Content
---

# Empty State

## When to use

Use when a collection or page region has no data to display.

## When not to use

- Use `error-recovery` when a request failed.
- Use a permission state when the user is not allowed to see or act on data.

## HyperShell decision

Use PatternFly `EmptyState` with a concise explanation and the next useful
action. Distinguish an initially empty collection from a filtered empty result:

- Initial empty: explain the purpose and offer the primary create or
  provisioning action.
- Filtered empty: explain that no results match and offer a clear-filters
  action.

## Canonical example

`Mockups/Gateways/Gateway list`

## Required states

- Initial empty.
- Filtered empty.
- Empty because related data is not configured.
- Empty with no permitted action.

## Accessibility

- Keep the empty state in the page region it explains.
- Use a heading where appropriate.
- Name the next action by its outcome.
- Do not remove navigation needed to leave the state.

## Responsive behavior

- Stack icon, heading, body, and action.
- Keep the action within the viewport.

## Do

- Offer only actions the user can perform.
- Explain why the state is empty when it is not obvious.
- Keep empty copy consistent with the owning user flow.

## Don't

- Treat an API error as an empty collection.
- Show a create action the user cannot perform.
- Use vague copy such as `Nothing to see here`.

## Related

- `state-coverage`
- `error-recovery`
- `create-flow`

