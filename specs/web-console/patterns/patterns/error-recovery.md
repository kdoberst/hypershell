---
id: error-recovery
title: Error and Recovery
status: approved
story: Mockups/Gateways/Gateway list
tags: [error, alert, retry, recovery]
components:
  - PatternFly Alert
  - PatternFly Button
  - PatternFly EmptyState
---

# Error and Recovery

## When to use

Use when an operation or data request fails, partially fails, or cannot be
completed because of permissions, configuration, or an external dependency.

## When not to use

- Use validation messages for user-input errors.
- Use a destructive confirmation before an operation starts.

## HyperShell decision

Use the standard PatternFly danger alert for API errors. Scope the alert to the
affected page region when the rest of the page remains useful. Offer an
actionable recovery action when technically possible, normally retry.

For partial failure:

- preserve successful results;
- identify affected objects;
- explain what remains incomplete;
- offer recovery for the failed subset.

## Canonical example

`Mockups/Gateways/Gateway list`

## Required states

- Load error.
- Operation error.
- Partial failure.
- Retry in progress.
- Retry success.
- Retry failure.
- Permission-limited state.

## Accessibility

- Use an alert role for important errors.
- Do not move focus unexpectedly.
- Keep the recovery action associated with the error it resolves.
- Preserve specific context instead of showing only `Something went wrong`.

## Responsive behavior

- Stack alert action with alert text.
- Keep recovery action visible.
- Avoid horizontal overflow for long object names.

## Do

- Explain the user impact and next action.
- Preserve entered or loaded data where safe.
- Distinguish temporary infrastructure failure from permanent permission
  denial.

## Don't

- Replace an entire page with an error when one section failed.
- Offer retry for an action that cannot safely be retried.
- Hide the affected objects during partial failure.

## Related

- `state-coverage`
- `destructive-action`
- `empty-state`

