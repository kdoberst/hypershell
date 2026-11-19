---
id: command-steps
title: Multi-Step Command Setup
status: approved
story: Production/Gateways/Gateway detail
tags: [commands, setup, accordion, cli]
components:
  - PatternFly Accordion
  - PatternFly CodeBlock
  - CommandBlock
  - PatternFly TextInput
---

# Multi-Step Command Setup

## When to use

Use when users must run several commands in order outside the web console.

## When not to use

Use `command-output` for a single copyable command.

## HyperShell decision

Use a bordered PatternFly accordion with one step expanded at a time. Each step
has a numbered, token-neutral heading, a one-time or every-time marker where
needed, explanatory content, and a copyable `CommandBlock`.

Customizable values use compact controls above the command. Commands must be
constructed from authorized values and must not ask users to paste credentials
into the browser.

## Canonical example

`Production/Gateways/Gateway detail`

## Required states

- Not ready to connect.
- Ready with all values.
- Missing a required value.
- Command value edited.
- Copy success.
- Copy failure.
- Step expanded and collapsed.

## Accessibility

- Preserve command text and line breaks for assistive technology.
- Name each copy action.
- Keep accordion controls operable with keyboard.
- Announce copy success or failure.

## Responsive behavior

- Wrap long commands without changing their meaning.
- Keep controls and commands stacked at narrow widths.

## Do

- Keep dependent commands in the required order.
- Explain prerequisites that exist outside the command.
- Use the same command builder as the CLI or API contract.

## Don't

- Put commands in images.
- Create a separate command builder for each page.
- Show an incomplete command as runnable.

## Related

- `command-output`
- `one-time-secret`
- `create-flow`

