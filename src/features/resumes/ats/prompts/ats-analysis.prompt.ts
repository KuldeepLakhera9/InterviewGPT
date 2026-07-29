export const ATS_SYSTEM_PROMPT = `
You are an expert Executive Resume Evaluator and Senior Technical Recruiter with deep knowledge of Applicant Tracking Systems (ATS) like Greenhouse, Lever, Workday, and Taleo.

Your task is to analyze candidate resume JSON data and text for:
1. ATS Readability & Technical Compatibility Score (0 - 100).
2. Human Recruiter First Impression Score (0 - 100).
3. Missing High-Impact Industry Keywords.
4. Weak or Underdeveloped Resume Sections.
5. Key Strengths & Competitive Highlights.
6. Actionable High/Medium/Low Impact Improvement Suggestions.
7. Formatting, Layout, and Document Structure Feedback.

CRITICAL INSTRUCTIONS:
- Do NOT perform Job Description matching against specific postings. Evaluate universal ATS standards and recruiter best practices for the candidate's target field.
- Respond ONLY with a valid, clean JSON object matching the required schema. Do not include markdown code blocks or explanatory wrapper text.
`;

export function buildAtsAnalysisPrompt(structuredData: unknown, cleanedText: string): string {
  const jsonStr =
    typeof structuredData === 'string' ? structuredData : JSON.stringify(structuredData, null, 2);

  return `
[INPUT RESUME STRUCTURED JSON]
${jsonStr}

[INPUT RESUME CLEANED TEXT]
${cleanedText.slice(0, 3000)}

Analyze the above resume data and return a JSON object with EXACTLY the following structure:

{
  "atsScore": 85,
  "recruiterScore": 88,
  "missingKeywords": [
    "System Architecture",
    "CI/CD Pipelines",
    "Unit Testing & Jest",
    "Performance Optimization"
  ],
  "weakSections": [
    {
      "section": "Work Experience",
      "issue": "Bullet points lack quantified business metric impact.",
      "recommendation": "Add percentage improvements, revenue metrics, or user scale to achievements."
    }
  ],
  "strengths": [
    "Strong technical skills section covering modern stack (React, Next.js, Node.js).",
    "Clear career progression in full stack development.",
    "Clean contact details and professional profile links."
  ],
  "suggestions": [
    {
      "category": "Impact Quantifying",
      "suggestion": "Include specific performance numbers (e.g. 'Reduced load times by 35%').",
      "impact": "High"
    },
    {
      "category": "Keyword Density",
      "suggestion": "Incorporate containerization keywords like Docker and Kubernetes into work history.",
      "impact": "Medium"
    }
  ],
  "formattingFeedback": [
    {
      "item": "Contact Information",
      "status": "Pass",
      "details": "Email, phone number, and location are clearly parseable at the header."
    },
    {
      "item": "Standard Section Headings",
      "status": "Pass",
      "details": "Standard section headers (SKILLS, EXPERIENCE, EDUCATION) used."
    },
    {
      "item": "Bullet Point Consistency",
      "status": "Warning",
      "details": "Ensure all bullet points begin with strong action verbs."
    }
  ]
}
`;
}
