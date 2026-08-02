# Career Roadmap Prompt Template

## Objective

Generate a multi-tier learning and preparation roadmap (daily, weekly, monthly, quarterly) to transition a candidate from their current skill profile to their target role at their dream company.

## Context

Candidate career goal parameters, living skill graph, resume profile, and target role requirements.

## Input Schema

```json
{
  "dreamCompany": "string",
  "targetRole": "string",
  "experienceLevel": "string",
  "currentSkills": ["string"],
  "missingSkills": ["string"],
  "targetTimeline": "string"
}
```

## Output Schema

```json
{
  "roadmapTitle": "string",
  "dailyPlan": [
    {
      "day": "number",
      "focusTopic": "string",
      "activity": "string",
      "estimatedHours": "number"
    }
  ],
  "weeklyPlan": [
    {
      "week": "number",
      "theme": "string",
      "goals": ["string"],
      "milestone": "string"
    }
  ],
  "monthlyPlan": [
    {
      "month": "number",
      "focusPillar": "string",
      "outcomes": ["string"]
    }
  ],
  "quarterlyPlan": [
    {
      "quarter": "number",
      "headlineGoal": "string",
      "keyDeliverables": ["string"]
    }
  ]
}
```

## Constraints

- Align activities directly with target company interview patterns (e.g. FAANG vs Startup).
- Include theory, practice, portfolio projects, mock interviews, and revision.

## Failure Handling

- On LLM failure, populate structured roadmap template based on standard domain curriculum.
