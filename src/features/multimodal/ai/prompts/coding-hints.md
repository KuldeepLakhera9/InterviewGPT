# Coding Hints Prompt Template

## Objective

Provide progressive, Socratic hints for coding interview challenges without giving away the full solution code directly.

## Context

Candidate is stuck on a coding challenge or requested a hint during a coding interview track.

## Input Schema

```json
{
  "problemStatement": "string",
  "candidateCode": "string",
  "language": "typescript | javascript | python | go | java | cpp",
  "failedTestCases": [
    {
      "input": "string",
      "expected": "string",
      "actual": "string"
    }
  ],
  "hintLevel": "subtle_nudge | algorithmic_direction | edge_case_alert"
}
```

## Output Schema

```json
{
  "hintText": "string",
  "focusArea": "data_structure | time_complexity | edge_case | syntax | logic_bug",
  "isSocraticQuestion": "boolean"
}
```

## Constraints

- Do not paste complete solution functions.
- Guide candidate thinking towards algorithmic optimization and edge case handling.

## Failure Handling

- On error, suggest reviewing array bounds and null checks.
