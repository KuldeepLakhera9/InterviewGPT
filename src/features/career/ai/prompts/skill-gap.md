# Skill Gap Prompt Template

## Objective

Analyze candidate skill graph against target role and target company requirements to identify missing skills, weak skills, learning priorities, and estimated learning hours.

## Context

Candidate skills vs target job description and company expectations.

## Input Schema

```json
{
  "targetRole": "string",
  "dreamCompany": "string",
  "candidateSkills": [
    {
      "name": "string",
      "level": "number",
      "category": "string"
    }
  ]
}
```

## Output Schema

```json
{
  "missingSkills": [
    {
      "name": "string",
      "category": "string",
      "importance": "critical | high | medium",
      "estimatedHoursToMaster": "number"
    }
  ],
  "weakSkills": [
    {
      "name": "string",
      "currentLevel": "number",
      "targetLevel": "number",
      "suggestedPractice": "string"
    }
  ],
  "overallReadinessPercentage": "number"
}
```

## Constraints

- Output strict JSON format with no markdown wrappers outside JSON.

## Failure Handling

- On error, compare skills against standard role baseline taxonomy.
