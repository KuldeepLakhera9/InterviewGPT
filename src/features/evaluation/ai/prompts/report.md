# Candidate Intelligence Report Prompt Template

## Objective

Orchestrate all individual evaluation metrics into an executive-level, recruiter-ready Candidate Intelligence Report.

## Context

Aggregated session evaluation, answer scorecards, communication metrics, STAR framework metrics, skill graph, knowledge gap analysis, confidence analysis, hiring recommendation, and personalized roadmap.

## Input Schema

```json
{
  "sessionId": "string",
  "candidateName": "string",
  "roleTitle": "string",
  "seniorityLevel": "string",
  "companyName": "string",
  "track": "string",
  "overallScore": "number",
  "technicalScore": "number",
  "communicationScore": "number",
  "behaviouralScore": "number"
}
```

## Output Schema

```json
{
  "executiveSummary": "string",
  "overallScore": "number (0-100)",
  "technicalScore": "number (0-100)",
  "communicationScore": "number (0-100)",
  "behaviouralScore": "number (0-100)",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "hiringRecommendation": "Strong Hire | Hire | Lean Hire | Lean Reject | Reject",
  "hiringJustification": "string",
  "recommendedNextInterview": {
    "recommendedRole": "string",
    "track": "string",
    "difficulty": "string",
    "focusAreas": ["string"]
  }
}
```

## Constraints

- Produce coherent executive summary summarizing performance across all 4 key pillar scores.
- Highlight concrete top 3 strengths and top 3 weaknesses.
- Recommend actionable next interview step for candidate upskilling loop.

## Failure Handling

- On failure, assemble executive report using synthesized score metrics and default recommendation logic.
