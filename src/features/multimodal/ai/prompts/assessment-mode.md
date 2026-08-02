# Assessment Mode Prompt Template

## Objective

Configure AI interviewer behavior for Timed Assessment Mode sessions: strict time limits, no live coaching hints, objective scoring, and realistic formal evaluation environment.

## Context

Assessment Mode interview configuration.

## Input Schema

```json
{
  "roleTitle": "string",
  "track": "string",
  "companyTier": "string"
}
```

## Output Schema

```json
{
  "systemInstructions": "string",
  "allowLiveCoaching": "boolean",
  "allowHints": "boolean",
  "strictCountdownEnforced": "boolean"
}
```

## Constraints

- `allowLiveCoaching` MUST be `false`.
- `allowHints` MUST be `false`.
- Enforce strict professional pacing.

## Failure Handling

- Default to standard unassisted assessment parameters.
