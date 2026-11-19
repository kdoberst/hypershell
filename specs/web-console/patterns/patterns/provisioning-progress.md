---
id: provisioning-progress
title: Provisioning Progress
status: approved
story: Production/Gateways/Gateway detail
tags: [provisioning, progress, conditions, stepper]
components:
  - PatternFly Alert
  - GatewayProvisioningStepper
---

# Provisioning Progress

## When to use

Use after a provisioning request is accepted but the resource is not yet ready
to use.

## When not to use

Use `inline-status` for a stable resource status in a table or summary.

## HyperShell decision

Show the current phase and meaningful conditions in a compact stepper between
the page header and body. Progress reflects observed control-plane conditions,
not elapsed time alone.

## Canonical example

`Production/Gateways/Gateway detail`

## Required states

- Provisioning.
- Waiting for console.
- Condition warning.
- Condition failure.
- Running.
- Unknown phase.

## Accessibility

- Identify current, complete, pending, warning, and failed steps.
- Do not rely on color alone.
- Expose condition text that explains the current wait.

## Responsive behavior

- Stack or compact steps without hiding the current phase.
- Keep condition text readable.

## Do

- Explain what the user is waiting for.
- Distinguish accepted work from completed readiness.
- Keep users on a route where progress can be observed.

## Don't

- Fabricate a percentage when the system reports conditions rather than
  completion percentage.
- Treat an endpoint as ready before the gateway phase is Running.
- Hide persistent failures in a spinner.

## Related

- `create-flow`
- `inline-status`
- `error-recovery`

