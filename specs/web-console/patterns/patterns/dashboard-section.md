---
id: dashboard-section
title: Dashboard Section and Widget
status: approved
story: Mockups/Dashboards/Operational dashboard
tags: [dashboard, cards, widgets]
components:
  - PatternFly Card
  - PatternFly Grid
  - PatternFly PageSection
  - HyperShell dashboard widget components
---

# Dashboard Section and Widget

## When to use

Use when users need a compact overview, comparison, trend, or prioritized set of
signals across multiple resources.

## When not to use

- Use `collection-table` when users need to compare many detailed records.
- Use `detail-page` when one resource is the primary focus.

## HyperShell decision

Use the secondary page body with white cards for a dashboard made of distinct
sections. Each card:

- has a concise task-oriented title;
- uses a semantic icon only when it aids recognition;
- states the data scope;
- provides the key signal first;
- explains what action or investigation it supports.

Do not add a card solely to compensate for a secondary background. Every card
must represent a distinct informational section.

## Canonical example

`Mockups/Dashboards/Operational dashboard`

## Required states

- Loaded.
- Loading.
- Empty or not configured.
- Error.
- Partial widget failure.
- Permission-limited data.
- Delayed or stale data where applicable.

## Accessibility

- Give each card a heading.
- Provide accessible names and summaries for charts.
- Do not use color alone for chart categories or status.
- Keep card action names specific.

## Responsive behavior

- Stack widgets in priority order at narrow widths.
- Keep charts readable without horizontal scrolling.
- Keep the most important signal above secondary detail.

## Do

- Explain filters, time ranges, and access constraints that affect values.
- Use shared dashboard components.
- Link to the collection or detail page where users can investigate.

## Don't
- Use decorative widgets without a user decision.
- Create one-off chart components when a shared widget exists.
- Mix many unrelated signals in one card.

## Related

- `page-layout`
- `status-summary`
- `content-and-data`

