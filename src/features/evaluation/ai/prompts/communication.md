# Communication Intelligence Prompt Template

## Objective

Analyze candidate spoken/written communication across linguistic structure, clarity, professional tone, filler words, and readability metrics.

## Context

Full interview transcript text composed of candidate responses across all questions in the interview session.

## Input Schema

```json
{
  "candidateTurnsText": ["string"],
  "totalWords": "number",
  "averageResponseLengthWords": "number"
}
```

## Output Schema

```json
{
  "grammarScore": "number (0-100)",
  "vocabularyScore": "number (0-100)",
  "clarityScore": "number (0-100)",
  "sentenceStructureScore": "number (0-100)",
  "concisenessScore": "number (0-100)",
  "professionalToneScore": "number (0-100)",
  "readabilityGrade": "string (e.g. Grade 11 / Professional)",
  "overallCommunicationScore": "number (0-100)",
  "fillerWordMetrics": {
    "totalFillerCount": "number",
    "frequentlyUsedFillers": [{ "word": "string", "count": "number" }],
    "fillerDensityPercentage": "number"
  },
  "responseLengthAnalysis": {
    "averageWordsPerTurn": "number",
    "verbosityAssessment": "concise | balanced | overly_verbose | brief"
  },
  "feedback": {
    "strengths": ["string"],
    "actionableTips": ["string"]
  }
}
```

## Constraints

- Output strict structured JSON with no extra commentary.
- Scores must be scaled integer values from 0 to 100.
- Filler words to scan include: "um", "uh", "like", "you know", "basically", "actually", "literally", "sort of", "kind of".

## Failure Handling

- On error or invalid JSON output, apply deterministic NLP heuristics on turn word counts, sentence lengths, and regex filler counts.
