---
id: dashboard-page
title: Dashboard Page
status: approved
story: Production/Dashboards/Operational
tags: [dashboard, navigation, filters, purpose]
components:
  - PatternFly PageSection
  - PatternFly Nav
  - DashboardNavigation
  - DashboardPurpose
  - DashboardFilterToolbar
---

# Dashboard Page

## When to use

Use for a dashboard route under the Dashboard section.

## When not to use

Use `dashboard-section` for an individual widget and `collection-table` for
record-level comparison and actions.

## HyperShell decision

Every dashboard page uses the same body sequence:

1. horizontal secondary navigation;
2. refresh control and updated-time label;
3. a purpose statement answering the dashboard's user questions;
4. filters and layout actions;
5. widgetized dashboard content;
6. widget drawer when customization is available.

Admin-only secondary navigation items are hidden when the user lacks the
dashboard administrator role.

## Canonical example

`Production/Dashboards/Operational`

## Required states

- Loaded.
- Initial load.
- Refreshing.
- Initial load failure.
- Partial source failure.
- Permission limited.
- No or unavailable metric.
- Widget drawer open and closed.

## Accessibility

- Name the secondary navigation and each dashboard control.
- Preserve heading hierarchy from page title through widget titles.
- Provide accessible chart summaries.
- Keep keyboard access to filters, refresh, widget drawer, and layout actions.

## Responsive behavior

- Keep secondary navigation horizontally scrollable or wrapped per PatternFly.
- Stack filters and actions when they cannot fit.
- Stack widgets by layout priority.

## Do

- State the questions the dashboard answers.
- Show data age when it affects interpretation.
- Scope failures to affected widgets.
- Preserve customized layouts according to the dashboard's persistence rules.

## Don't

- Add a page-specific dashboard toolbar unrelated to the shared sequence.
- Hide partial failures behind a general page error.
- Expose admin-only navigation to unauthorized users.
- Create a dashboard without a clear user question.

## Related

- `application-shell`
- `dashboard-section`
- `metric-unavailable`

