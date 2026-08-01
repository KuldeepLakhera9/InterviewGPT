# STAR Framework Evaluation Prompt Template

## Objective

Evaluate candidate responses to behavioural interview questions using the STAR (Situation, Task, Action, Result) methodology.

## Context

Behavioural interview turn where candidate describes a past experience, conflict, project, or situation.

## Input Schema

```json
{
  "questionText": "string",
  "candidateAnswer": "string",
  "seniorityLevel": "string"
}
```

## Output Schema

```json
{
  "isStarApplicable": "boolean",
  "overallStarScore": "number (0-100)",
  "situation": {
    "score": "number (0-100)",
    "summary": "string",
    "isMissing": "boolean"
  },
  "task": {
    "score": "number (0-100)",
    "summary": "string",
    "isMissing": "boolean"
  },
  "action": {
    "score": "number (0-100)",
    "summary": "string",
    "isMissing": "boolean"
  },
  "result": {
    "score": "number (0-100)",
    "summary": "string",
    "isMissing": "boolean",
    "hasQuantifiableMetrics": "boolean"
  },
  "missingSections": ["string"],
  "improvementSuggestions": ["string"]
}
```

## Constraints

- Evaluate whether quantifiable impact/metrics are included in the Result phase.
- Flag missing sections explicitly in `missingSections`.
- Give actionable suggestions to convert non-STAR or partial-STAR answers into complete STAR stories.

## Failure Handling

- On failure, parse answer via heuristic sentence segmentation looking for situation ("when I was at..."), task ("my role was..."), action ("I implemented..."), and result ("which reduced...").
