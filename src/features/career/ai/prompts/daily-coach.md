# Daily AI Coach Prompt Template

## Objective

Generate a set of 5 daily actionable career preparation tasks (coding question, behavioral prompt, system design task, resume task, communication exercise) to maintain study consistency and streak progress.

## Context

Active candidate streak count, skill graph gaps, and target role title.

## Input Schema

```json
{
  "targetRole": "string",
  "currentStreak": "number",
  "weakSkills": ["string"]
}
```

## Output Schema

```json
{
  "dailyGreeting": "string",
  "dailyTasks": [
    {
      "taskId": "string",
      "category": "coding | behavioral | system_design | resume | communication",
      "title": "string",
      "estimatedMinutes": "number",
      "xpReward": "number"
    }
  ]
}
```

## Constraints

- Keep daily tasks achievable within 15-45 minutes to encourage consistent daily engagement.

## Failure Handling

- On error, serve fallback daily challenge set.
