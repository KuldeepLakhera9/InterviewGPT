# Live Coaching Prompt Template

## Objective

Analyze real-time candidate speech analytics, audio gain, filler word frequency, and computer vision presence metrics to output non-intrusive, constructive live coaching hints during practice interviews.

## Context

Active practice mode interview turn where candidate is speaking.

## Input Schema

```json
{
  "speakingPaceWpm": "number",
  "audioLevelDb": "number",
  "fillerWordCount": "number",
  "fillerDensityPercentage": "number",
  "currentTurnDurationSeconds": "number",
  "isFaceCentred": "boolean",
  "isEyeContactMaintained": "boolean",
  "interviewMode": "practice | assessment"
}
```

## Output Schema

```json
{
  "shouldDisplayToast": "boolean",
  "coachingCategory": "pace | volume | presence | filler_words | response_length",
  "toastMessage": "string",
  "severity": "info | warning | tip"
}
```

## Constraints

- In `assessment` mode, `shouldDisplayToast` MUST ALWAYS evaluate to `false`.
- Toasts must be short, helpful, and supportive (under 10 words).
- Avoid repetitive nagging; throttle duplicate alerts.

## Failure Handling

- On evaluation error, return `shouldDisplayToast: false`.
