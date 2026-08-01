# Answer Evaluation Engine Prompt Template

## Objective

Evaluate a candidate's response to an interview question across 8 core qualitative dimensions and return a structured JSON evaluation scorecard.

## Context

The evaluation is conducted in the context of a technical or behavioural interview for a specific target role title, seniority level, track, and company tier.

## Input Schema

```json
{
  "questionText": "string",
  "candidateAnswer": "string",
  "roleTitle": "string",
  "seniorityLevel": "string",
  "track": "technical | system_design | behavioral | full_loop",
  "difficulty": "easy | medium | hard | expert",
  "idealOutline": "string (optional)"
}
```

## Output Schema

```json
{
  "turnId": "string",
  "scores": {
    "technicalAccuracy": "number (0-100)",
    "completeness": "number (0-100)",
    "relevance": "number (0-100)",
    "clarity": "number (0-100)",
    "structure": "number (0-100)",
    "examplesUsed": "number (0-100)",
    "depthOfKnowledge": "number (0-100)",
    "communication": "number (0-100)"
  },
  "overallAnswerScore": "number (0-100)",
  "strengths": ["string"],
  "gaps": ["string"],
  "keyConceptsCovered": ["string"],
  "keyConceptsMissed": ["string"],
  "feedbackSummary": "string",
  "improvedAnswerOutline": "string"
}
```

## Constraints

- Return valid JSON matching Output Schema strictly.
- Never output Markdown code block wrappers or conversational preambles outside the raw JSON object.
- All numeric scores must be integers between 0 and 100 inclusive.
- Assess depth based on seniority level expectations (e.g., senior candidates require architectural tradeoffs and edge-case handling).

## Failure Handling

If parsing fails or LLM output is malformed:

- Fallback to rule-based fallback scoring matrix.
- Emit structured warning log with prompt ID and raw string payload.
- Trigger automatic schema sanitizer.
