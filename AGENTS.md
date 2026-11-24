# HyperShell agent rules

## Mandatory UI change flow

For every new or changed HyperShell web-console UI, read and execute
`skills/web-console/ui-change-flow/SKILL.md`. Classify the change, make the
spec decision, determine every applicable check, and validate to completion
before reporting the UI work.

Mockups are optional inputs, not required deliverables. Do not create a
repository mockup unless the task explicitly includes mockup or spec work.
For a new or materially changed production page with an approved mockup, invoke
the UI build gate from the canonical UI flow and wait for its terminal state.
Human UI review, when triggered by the canonical flow, blocks automatic merge
eligibility but not automated code review.

## Repository conventions

Read `CLAUDE.md` before implementation and follow its repository commands and
critical conventions.

## Secret safety

Never print, log, copy, transmit, or otherwise expose secret values. Do not
expose broad runtime context or signed-in client state. When checking
configuration, inspect only explicitly allowlisted variable names, or report a
variable as present or absent without emitting its value. If a command might
return secrets, redirect or filter it before output and never paste raw output
into the conversation.

## Forbidden browser DOM injection

Never use React's raw-HTML prop, DOM HTML properties or methods, or equivalent
HTML-injection helpers in browser source, Storybook stories, or mockups. Render
React elements or use an approved parser that returns React elements. Run
`make check-forbidden-dom-injection` before handing off browser UI changes.
