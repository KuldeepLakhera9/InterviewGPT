export const JOB_MATCHING_SYSTEM_PROMPT = `
You are an expert Technical Hiring Manager and Career Strategist evaluating candidate fit against specific Job Descriptions.

Your task is to compare candidate resume JSON and text against a target Job Description and produce a structured comparison report containing:
1. Overall Match Percentage (0 - 100).
2. Missing Skills (technical or soft skills explicitly required by the Job Description but absent or weak in candidate resume).
3. Keyword Gaps (missing domain terminology & density gaps).
4. Recommended Resume Improvements (actionable bullet edits & keyword additions).
5. Recommended Learning Resources (curated courses, documentation links, or certification recommendations).

CRITICAL INSTRUCTIONS:
- Do NOT generate interview questions or interview preparation scripts.
- Respond ONLY with clean, valid JSON matching the exact schema requested. Do not include markdown code block wrappers or explanatory text.
`;

export function buildJobMatchingPrompt(
  structuredData: unknown,
  cleanedText: string,
  jobDescriptionText: string
): string {
  const jsonStr =
    typeof structuredData === 'string' ? structuredData : JSON.stringify(structuredData, null, 2);

  return `
[CANDIDATE RESUME STRUCTURED JSON]
${jsonStr}

[CANDIDATE RESUME TEXT]
${cleanedText.slice(0, 3000)}

[TARGET JOB DESCRIPTION]
${jobDescriptionText.slice(0, 4000)}

Compare the candidate's resume against the Target Job Description and return a JSON object with EXACTLY this structure:

{
  "overallMatchPercentage": 82,
  "missingSkills": [
    "GraphQL",
    "Docker & Containerization",
    "AWS Lambda / Serverless",
    "Micro-Frontends"
  ],
  "keywordGaps": [
    {
      "keyword": "Kubernetes",
      "significance": "Crucial requirement for cloud orchestration mentioned in job responsibilities."
    },
    {
      "keyword": "Jest & Vitest Unit Testing",
      "significance": "Required for automated test-driven development workflow."
    }
  ],
  "recommendedImprovements": [
    {
      "area": "Cloud Architecture",
      "suggestion": "Explicitly mention experience with AWS cloud services or serverless deployments in work history.",
      "impact": "High"
    },
    {
      "area": "Automated Testing",
      "suggestion": "Add testing frameworks (Vitest, Jest, Cypress) to skills and achievement bullet points.",
      "impact": "High"
    }
  ],
  "recommendedLearningResources": [
    {
      "title": "Docker & Kubernetes: The Complete Guide",
      "platform": "Udemy / Official Docs",
      "link": "https://docs.docker.com/get-started/",
      "reason": "Bridge containerization keyword gap required by job description."
    },
    {
      "title": "AWS Serverless Developer Guide",
      "platform": "AWS Skill Builder",
      "link": "https://aws.amazon.com/training/",
      "reason": "Master serverless cloud patterns specified in job requirements."
    }
  ]
}
`;
}
