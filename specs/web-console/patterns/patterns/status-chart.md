---
id: status-chart
title: Status Donut Chart
status: approved
story: Production/Dashboards/Operational
tags: [chart, donut, status, legend]
components:
  - PatternFly ChartDonut
  - PatternFly ChartLegend
  - StatusDonutChart
---

# Status Donut Chart

## When to use

Use to show the distribution of resource states when the total and proportions
help the user decide whether to investigate.

## When not to use

Use `inline-status` for one resource and `status-summary` for an aggregate
severity. Use a trend chart when change over time is the main question.

## HyperShell decision

Use the shared `StatusDonutChart` with an accessible title and description,
center total, vertical legend, and bounded status colors. Compact sizing is for
standard widgets; expanded sizing is used when a subtitle or additional legend
space is required.

## Canonical example

`Production/Dashboards/Operational`

## Required states

- Loaded.
- Empty data.
- Single status.
- Mixed statuses.
- Metric unavailable.
- Partial source failure.

## Accessibility

- Provide `ariaTitle` and `ariaDesc` through the shared chart component.
- Include legend text so color is not the only carrier.
- Keep chart labels readable at compact widget size.

## Responsive behavior

- Measure the container with a resize observer.
- Keep the legend inside the widget without clipping.
- Reduce to a readable alternative if the chart cannot fit.

## Do

- Use shared status-to-color data mappings.
- Show zero-value statuses only when their absence would mislead.
- Keep the center total consistent with legend values.

## Don't

- Define a new color scale in a page component.
- Use decorative colors for semantic statuses.
- Clip the legend to force a chart into a widget.

## Related

- `status-vocabulary`
- `dashboard-section`
- `metric-unavailable`

