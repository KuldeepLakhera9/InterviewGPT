# Personalized Learning Roadmap Prompt Template

## Objective

Generate a multi-tier learning roadmap (daily plan, weekly roadmap, monthly roadmap, recommended projects, mock practice questions, and learning resources) tailored to candidate resume, target role, and interview performance gaps.

## Context

Candidate knowledge gaps, missed concepts, resume skills, and target job role requirement parameters.

## Input Schema

```json
{
  "roleTitle": "string",
  "seniorityLevel": "string",
  "knowledgeGaps": ["string"],
  "weakConcepts": ["string"],
  "resumeSkills": ["string"],
  "targetCompanyTier": "string"
}
```

## Output Schema

```json
{
  "dailyPlan": [
    {
      "day": "number (1-7)",
      "focusTopic": "string",
      "activity": "string",
      "estimatedHours": "number"
    }
  ],
  "weeklyRoadmap": [
    {
      "week": "number (1-4)",
      "theme": "string",
      "goals": ["string"],
      "milestone": "string"
    }
  ],
  "monthlyRoadmap": [
    {
      "month": "number (1-3)",
      "milestoneTitle": "string",
      "keyDeliverables": ["string"]
    }
  ],
  "recommendedProjects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"],
      "difficulty": "beginner | intermediate | advanced"
    }
  ],
  "recommendedQuestions": [
    {
      "questionText": "string",
      "topic": "string",
      "category": "technical | system_design | behavioral"
    }
  ],
  "learningResources": [
    {
      "title": "string",
      "type": "documentation | book | video | interactive_lab",
      "urlOrReference": "string"
    }
  ],
  "practiceSchedule": {
    "recommendedInterviewsPerWeek": "number",
    "targetAreasToPractice": ["string"]
  }
}
```

## Constraints

- Plans must directly target the identified `knowledgeGaps` and `weakConcepts`.
- Projects recommended must be production-level portfolio projects suitable for the candidate's target seniority.

## Failure Handling

- On failure, populate template from predefined domain knowledge bases indexed by topic (e.g. system design, async concurrency, STAR storytelling).
