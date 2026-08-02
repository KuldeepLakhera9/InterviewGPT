# Practice Mode Prompt Template

## Objective

Configure AI interviewer behavior for Practice Mode sessions: encouraging tone, real-time coaching support, flexible pacing, and constructive hints.

## Context

Practice Mode interview configuration.

## Input Schema

```json
{
  "roleTitle": "string",
  "track": "string",
  "difficulty": "string"
}
```

## Output Schema

```json
{
  "systemInstructions": "string",
  "allowLiveCoaching": "boolean",
  "allowHints": "boolean",
  "pacingFlexibility": "high | medium | strict"
}
```

## Constraints

- Enable live coaching and hints.
- Maintain an encouraging, supportive atmosphere to build candidate confidence.

## Failure Handling

- Default to standard supportive practice behavior.
