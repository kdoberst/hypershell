---
id: command-output
title: Command Output
status: approved
story: Mockups/Gateways/Gateway list
tags: [command, cli, copy, code]
components:
  - PatternFly Modal
  - PatternFly ClipboardCopy
  - HyperShell CommandBlock
---

# Command Output

## When to use

Use when the UI gives the user a command to run outside the web console, such
as connecting to a gateway.

## When not to use

- Do not show a command when a safe in-product action can complete the task.
- Use ordinary code formatting for static documentation examples.

## HyperShell decision

Use the shared command component rather than recreating markup. Keep the command
read-only, copyable, and clearly scoped to the selected object. Use a modal or
detail section depending on whether the user needs persistent context.

## Canonical example

`Mockups/Gateways/Gateway list`

## Required states

- Loaded.
- Copy success.
- Copy failure.
- Clipboard unavailable.
- Long command or endpoint.

## Accessibility

- Expose the full command to assistive technology.
- Announce copy success or failure.
- Name the copy action and the object it applies to.
- Preserve line breaks needed to run the command.

## Responsive behavior

- Wrap long commands without changing their meaning.
- Keep copy action available.
- Avoid horizontal overflow in modal and detail contexts.

## Do

- Use the actual endpoint or deterministic realistic value.
- Explain where the user should run the command when it matters.
- Prefer a shared command component.

## Don't
- Put a command in an image.
- Create a page-specific code component.
- Copy a different value than the one displayed.

## Related

- `content-and-data`
- `detail-page`
- `collection-table`

