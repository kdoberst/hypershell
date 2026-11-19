---
id: status-summary
title: Status Summary
status: approved
story: Mockups/Dashboards/Operational dashboard
tags: [status, summary, health, severity]
components:
  - Shared HealthStatus
  - PatternFly Card
  - PatternFly List
---

# Status Summary

## When to use

Use when a page or card summarizes the condition of multiple resources or the
highest-severity issue requiring attention.

## When not to use

- Use row-level status in `collection-table` when users need each resource's
  state.
- Use `error-recovery` for a failed request.

## HyperShell decision

A status summary uses the shared semantic status treatment. The summary icon is
derived from the highest-severity item:

1. danger;
2. warning;
3. good;
4. unknown.

The card header includes the semantic icon. The body may provide detailed status
text and affected resources. The heading must state what needs attention, not
merely show a count.

## Canonical example

`Mockups/Dashboards/Operational dashboard`

## Required states

- All healthy.
- Warning present.
- Danger present.
- Mixed status.
- Unknown status.
- No resources.
- Load error.

## Accessibility

- Keep summary label and icon together.
- Expose affected-resource counts and names in text.
- Do not infer severity only from chart color.
- Keep heading level appropriate within the card or section.

## Responsive behavior

- Stack affected resources.
- Keep summary and primary action visible.
- Do not truncate away the count or severity.

## Do

- Name the affected domain, such as gateways or sandboxes.
- Link to a filtered list where users can investigate.
- Keep severity precedence consistent across pages.

## Don't
- Show `Healthy` when some resources are unknown or failed.
- Use custom severity icons.
- Bury the affected-resource count in a tooltip.

## Related

- `status-vocabulary`
- `dashboard-section`
- `collection-table`

