export const OPTIMISER_SYSTEM_PROMPT = `
You are an elite Senior Executive Resume Writer and Career Strategist who has helped over 5,000 technology professionals land senior roles at top companies.

Your objective is to optimize candidate resume content by:
1. Rewriting passive work experience bullet points using high-impact, past-tense power action verbs (e.g. "Architected", "Engineered", "Orchestrated", "Spearheaded") paired with metric quantification placeholders.
2. Elevating basic summaries into compelling 3-4 sentence professional value propositions.
3. Suggesting stronger, high-potency action verbs to replace weak or passive verbs (e.g. replacing "worked on" or "helped with").
4. Adding measurable impact metrics (percentage speedups, user scale, cost reductions).
5. Outputting a polished, full text version ready for 1-click export.

CRITICAL INSTRUCTIONS:
- Do NOT perform Job Description matching against specific postings. Focus on universal executive resume optimization rules.
- Respond ONLY with clean, valid JSON matching the required schema. Do not include markdown wrapper blocks or extra text.
`;

export function buildResumeOptimiserPrompt(structuredData: unknown, cleanedText: string): string {
  const jsonStr =
    typeof structuredData === 'string' ? structuredData : JSON.stringify(structuredData, null, 2);

  return `
[INPUT RESUME STRUCTURED JSON]
${jsonStr}

[INPUT RESUME CLEANED TEXT]
${cleanedText.slice(0, 3000)}

Optimize the candidate's resume content and return a JSON object with EXACTLY the following structure:

{
  "originalSummary": "Software engineer with 5 years experience.",
  "optimisedSummary": "Results-driven Senior Full Stack Engineer with 5+ years of experience engineering high-throughput distributed systems and responsive web applications. Proven track record of scaling Next.js micro-frontends and optimizing PostgreSQL databases for enterprise platforms.",
  "originalBullets": [
    "Worked on React frontend components for company portal.",
    "Helped backend team with database queries and API endpoints."
  ],
  "optimisedBullets": [
    {
      "original": "Worked on React frontend components for company portal.",
      "rewritten": "Architected modular React and TypeScript component libraries, reducing frontend bundle size by 35% and improving page rendering speeds.",
      "actionVerb": "Architected",
      "impactGain": "+40% Impact Gain"
    },
    {
      "original": "Helped backend team with database queries and API endpoints.",
      "rewritten": "Engineered high-concurrency Node.js RESTful APIs and optimized PostgreSQL query indexes, serving over 500,000 daily active API requests.",
      "actionVerb": "Engineered",
      "impactGain": "+35% Impact Gain"
    }
  ],
  "strongerActionVerbs": [
    {
      "weakVerb": "worked on",
      "suggestedVerbs": ["Architected", "Engineered", "Orchestrated", "Constructed"]
    },
    {
      "weakVerb": "helped with",
      "suggestedVerbs": ["Spearheaded", "Coordinated", "Accelerated", "Championed"]
    },
    {
      "weakVerb": "responsible for",
      "suggestedVerbs": ["Directed", "Managed", "Executed", "Overhauled"]
    }
  ],
  "measurableImpactItems": [
    {
      "bullet": "Frontend Component Optimization",
      "metricSuggestion": "Quantify load time improvements (e.g. 'Reduced initial load latency by 35%')."
    },
    {
      "bullet": "API Performance",
      "metricSuggestion": "Specify transaction or request throughput scale (e.g. 'Handled 500K+ daily active requests with 99.9% uptime')."
    }
  ],
  "optimisedTextContent": "JANE SMITH\\nSenior Full Stack Engineer\\njane@example.com | (555) 123-4567\\n\\nPROFESSIONAL SUMMARY\\nResults-driven Senior Full Stack Engineer with 5+ years of experience engineering high-throughput distributed systems and responsive web applications.\\n\\nWORK EXPERIENCE\\n- Architected modular React and TypeScript component libraries, reducing bundle size by 35%.\\n- Engineered high-concurrency Node.js RESTful APIs serving 500K+ daily active requests.\\n\\nSKILLS\\nTypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS"
}
`;
}
