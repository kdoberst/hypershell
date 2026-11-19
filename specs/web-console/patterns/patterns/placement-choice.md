---
id: placement-choice
title: Placement Choice
status: approved
story: Production/Gateways/Create gateway
tags: [placement, choice, recommendation, provisioning]
components:
  - PatternFly Card
  - PatternFly Radio
  - PatternFly Tooltip
  - PatternFly Form
---

# Placement Choice

## When to use

Use when the user selects an intent or capability and the platform resolves the
concrete resource.

## When not to use

Do not use this pattern when the user must choose a concrete cluster or
namespace. HyperShell provisioning submits placement intent, not a selected
cluster.

## HyperShell decision

Choices use radio semantics inside selectable cards. The card title and
description identify the user-visible capability. Disabled choices expose the
unavailable reason both visually and to assistive technology.

Advanced or rarely needed capabilities are hidden behind an expandable section.
A recommendation card may sit beside the form when it helps the user choose.

## Canonical example

`Production/Gateways/Create gateway`

## Required states

- Availability loading.
- Available choices.
- Disabled choice with reason.
- No managed placement.
- Availability error.
- Selected and unselected choices.
- Advanced options expanded.

## Accessibility

- Use one radio group for mutually exclusive choices.
- Associate disabled reasons with the disabled option.
- Do not use the card alone as the input.
- Keep selection state available to assistive technology.

## Responsive behavior

- Stack choice cards and the recommendation panel.
- Keep disabled reasons readable without truncation.

## Do

- Prefer an available default when the platform can infer it safely.
- Explain why a choice is unavailable.
- Keep the recommended choice clearly marked but still selectable.

## Don't

- Ask for a concrete cluster or namespace.
- Disable a choice without a reason.
- Duplicate the same capability in multiple choice groups.

## Related

- `create-flow`
- `form-section`
- `placement-choice`

