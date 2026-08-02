# Learning Plan Prompt Template

## Objective

Structure detailed daily and weekly study units covering theory, coding practice, system design, behavioral storytelling, and mock revision.

## Context

Target skill topic, candidate seniority, and daily available study hours.

## Input Schema

```json
{
  "focusSkill": "string",
  "dailyHours": "number",
  "seniority": "string"
}
```

## Output Schema

```json
{
  "planTitle": "string",
  "learningUnits": [
    {
      "unitTitle": "string",
      "type": "theory | practice | project | mock | revision",
      "durationMinutes": "number",
      "keyTakeaway": "string"
    }
  ]
}
```

## Constraints

- Output structured JSON payload.

## Failure Handling

- Fallback to modular curriculum templates.
