---
id: operation-result
title: Operation Result Notification
status: approved
story: Production/Gateways/Gateway list
tags: [success, toast, notification, result]
components:
  - PatternFly AlertGroup
  - PatternFly Alert
  - PatternFly AlertActionCloseButton
---

# Operation Result Notification

## When to use

Use for a completed non-destructive operation or accepted destructive operation
that leaves the user on a useful page.

## When not to use

Use an inline alert for a load error or an operation that failed before changing
state. Use a result banner for partial bulk-operation outcomes.

## HyperShell decision

Successful rename and deletion results use a live toast alert group. The alert
names the affected object, closes manually, and times out automatically. The
underlying page remains visible.

## Canonical example

`Production/Gateways/Gateway list`

## Required states

- Result shown.
- Result dismissed manually.
- Result dismissed by timeout.
- Multiple simultaneous results.
- Result after navigation back to the collection.

## Accessibility

- Use a live region for the toast group.
- Provide a named close action.
- Keep the timeout long enough to read the result.
- Do not move focus to the toast.

## Responsive behavior

- Keep the toast within the viewport.
- Stack the title and close action when needed.

## Do

- Name the object that changed.
- Distinguish accepted asynchronous cleanup from completed cleanup.
- Clear navigation state after dismissal.

## Don't

- Use a success toast for a failed or partial operation.
- Leave stale success state in browser history.
- Block page interaction while showing the result.

## Related

- `error-recovery`
- `destructive-action`
- `url-state-persistence`

