# Project Recommendations Prompt Template

## Objective

Recommend high-impact portfolio projects tailored to candidate career goal, missing skills, target company tech stack, and industry trends.

## Context

Candidate target role, target company, and current skill graph gaps.

## Input Schema

```json
{
  "targetRole": "string",
  "dreamCompany": "string",
  "missingSkills": ["string"],
  "experienceLevel": "string"
}
```

## Output Schema

```json
{
  "recommendedProjects": [
    {
      "title": "string",
      "description": "string",
      "difficulty": "beginner | intermediate | advanced",
      "estimatedDuration": "string",
      "techStack": ["string"],
      "learningOutcomes": ["string"],
      "resumeImpact": "string"
    }
  ]
}
```

## Constraints

- Recommend production-grade, non-trivial projects (e.g. distributed cache middleware, real-time analytics engine, optimistic state synchronizer).

## Failure Handling

- On error, serve pre-curated industry portfolio project library.
