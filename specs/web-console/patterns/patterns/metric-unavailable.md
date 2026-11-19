---
id: metric-unavailable
title: Metric Unavailable
status: approved
story: Production/Dashboards/Operational
tags: [metric, unavailable, empty, dashboard]
components:
  - PatternFly EmptyState
  - PatternFly Bullseye
  - DashboardMetricUnavailable
---

# Metric Unavailable

## When to use

Use inside a dashboard widget when one metric is absent, not configured, or
cannot be loaded while other widgets remain useful.

## When not to use

Use `error-recovery` for a whole page load failure. Use `empty-state` when a
collection has no records.

## HyperShell decision

Render a small centered empty state inside the affected widget. Keep the widget
title and surrounding dashboard available. Distinguish unavailable data from a
zero value.

## Canonical example

`Production/Dashboards/Operational`

## Required states

- Metric absent.
- Metric not configured.
- Source load failed.
- Partial dashboard load.
- Zero value, rendered as data rather than unavailable.

## Accessibility

- Use a heading inside the widget empty state.
- Keep the empty state in the accessibility order after the widget title.
- Do not remove the widget from the accessibility tree.

## Responsive behavior

- Center the message within the widget.
- Keep text readable without increasing widget height unexpectedly.

## Do

- Scope the message to the failed metric.
- Explain whether the metric is unavailable or has no data.
- Keep retry at dashboard level when one refresh covers the source.

## Don't

- Replace the whole dashboard with an error.
- Show zero when the source is unavailable.
- Hide the widget title.

## Related

- `dashboard-section`
- `dashboard-page`
- `error-recovery`

