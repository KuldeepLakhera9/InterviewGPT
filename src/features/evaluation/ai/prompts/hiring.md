# Hiring Recommendation Prompt Template

## Objective

Synthesize candidate performance across all interview dimensions to generate a recruiter-grade hiring recommendation with concrete evidence-backed justification.

## Context

Full session evaluation summary including technical scores, communication metrics, behavioural STAR scores, skill breakdown, and candidate seniority level vs role requirements.

## Input Schema

```json
{
  "roleTitle": "string",
  "seniorityLevel": "string",
  "companyName": "string",
  "companyTier": "tier_1 | tier_2 | tier_3 | startup",
  "overallScore": "number",
  "technicalScore": "number",
  "communicationScore": "number",
  "behaviouralScore": "number",
  "keyStrengths": ["string"],
  "keyGaps": ["string"],
  "transcriptTurnSummaries": ["string"]
}
```

## Output Schema

```json
{
  "recommendation": "Strong Hire | Hire | Lean Hire | Lean Reject | Reject",
  "recommendationScore": "number (0-100)",
  "confidenceScore": "number (0-100)",
  "executiveSummary": "string",
  "evidenceJustification": {
    "technicalEvidence": ["string"],
    "communicationEvidence": ["string"],
    "culturalAndBehaviouralEvidence": ["string"],
    "concernsAndRisks": ["string"]
  },
  "readinessRating": "ready_now | ready_with_minor_coaching | needs_significant_upskilling | not_recommended",
  "nextStepsForRecruiter": ["string"]
}
```

## Constraints

- Recommendation MUST strictly be one of: `Strong Hire`, `Hire`, `Lean Hire`, `Lean Reject`, `Reject`.
- Every recommendation must cite specific candidate turn quotes or evaluation scores as evidence.
- High bar for Tier 1 / FAANG companies vs startup tier.

## Failure Handling

- On failure, compute recommendation deterministically:
  - overallScore >= 85: Strong Hire
  - 75-84: Hire
  - 65-74: Lean Hire
  - 55-64: Lean Reject
  - < 55: Reject
