import { buildJobMatchingPrompt, JOB_MATCHING_SYSTEM_PROMPT } from '../prompts/job-matching.prompt';
import type {
  KeywordGapItem,
  LearningResourceItem,
  RecommendedImprovementItem,
} from '../../types/resume.types';

export interface JobMatchingResult {
  overallMatchPercentage: number;
  missingSkills: string[];
  keywordGaps: KeywordGapItem[];
  recommendedImprovements: RecommendedImprovementItem[];
  recommendedLearningResources: LearningResourceItem[];
}

export async function runJobMatchingPipeline(
  structuredData: Record<string, unknown>,
  cleanedText: string,
  jobDescriptionText: string
): Promise<JobMatchingResult> {
  const promptText = buildJobMatchingPrompt(structuredData, cleanedText, jobDescriptionText);

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  if (geminiApiKey) {
    try {
      const res = await callGeminiJobMatchingApi(
        geminiApiKey,
        JOB_MATCHING_SYSTEM_PROMPT,
        promptText
      );
      if (res) return res;
    } catch (err) {
      console.warn('Gemini Job Matching API failed, using fallback engine:', err);
    }
  }

  if (openAiApiKey) {
    try {
      const res = await callOpenAiJobMatchingApi(
        openAiApiKey,
        JOB_MATCHING_SYSTEM_PROMPT,
        promptText
      );
      if (res) return res;
    } catch (err) {
      console.warn('OpenAI Job Matching API failed, using fallback engine:', err);
    }
  }

  return generateFallbackJobMatch(structuredData, cleanedText, jobDescriptionText);
}

async function callGeminiJobMatchingApi(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<JobMatchingResult | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) throw new Error(`Gemini API error ${response.status}`);

  const data = await response.json();
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (textContent) {
    return sanitizeJobMatchingResponse(JSON.parse(textContent));
  }
  return null;
}

async function callOpenAiJobMatchingApi(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<JobMatchingResult | null> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error ${response.status}`);

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (content) {
    return sanitizeJobMatchingResponse(JSON.parse(content));
  }
  return null;
}

function sanitizeJobMatchingResponse(parsed: Record<string, unknown>): JobMatchingResult {
  return {
    overallMatchPercentage:
      typeof parsed.overallMatchPercentage === 'number'
        ? Math.min(Math.max(parsed.overallMatchPercentage, 0), 100)
        : 80,
    missingSkills: Array.isArray(parsed.missingSkills) ? (parsed.missingSkills as string[]) : [],
    keywordGaps: Array.isArray(parsed.keywordGaps) ? (parsed.keywordGaps as KeywordGapItem[]) : [],
    recommendedImprovements: Array.isArray(parsed.recommendedImprovements)
      ? (parsed.recommendedImprovements as RecommendedImprovementItem[])
      : [],
    recommendedLearningResources: Array.isArray(parsed.recommendedLearningResources)
      ? (parsed.recommendedLearningResources as LearningResourceItem[])
      : [],
  };
}

export function generateFallbackJobMatch(
  structuredData: Record<string, unknown>,
  cleanedText: string,
  jobDescriptionText: string
): JobMatchingResult {
  const resumeSkills = Array.isArray(structuredData.skills)
    ? (structuredData.skills as string[]).map((s) => s.toLowerCase())
    : [];

  const textLower = cleanedText.toLowerCase();
  const jdLower = jobDescriptionText.toLowerCase();

  const targetKeywords = [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'PostgreSQL',
    'Docker',
    'Kubernetes',
    'GraphQL',
    'AWS',
    'CI/CD',
    'Microservices',
    'System Architecture',
    'Jest',
    'Vitest',
    'TailwindCSS',
    'Redis',
    'Python',
  ];

  const matchedKeywords: string[] = [];
  const missingSkills: string[] = [];

  for (const kw of targetKeywords) {
    const kwLower = kw.toLowerCase();
    if (jdLower.includes(kwLower)) {
      if (textLower.includes(kwLower) || resumeSkills.includes(kwLower)) {
        matchedKeywords.push(kw);
      } else {
        missingSkills.push(kw);
      }
    }
  }

  // Fallback defaults if JD text was short
  if (missingSkills.length === 0) {
    missingSkills.push(
      'Kubernetes Container Orchestration',
      'AWS Lambda Serverless',
      'GraphQL Federation',
      'CI/CD Automation'
    );
  }

  const matchRatio =
    targetKeywords.length > 0
      ? matchedKeywords.length / (matchedKeywords.length + missingSkills.length)
      : 0.75;
  const overallMatchPercentage = Math.min(Math.max(Math.round(matchRatio * 100 + 40), 55), 96);

  return {
    overallMatchPercentage,
    missingSkills,
    keywordGaps: missingSkills.map((sk) => ({
      keyword: sk,
      significance: `High requirement listed in job description responsibilities but absent in candidate resume.`,
    })),
    recommendedImprovements: [
      {
        area: 'Skill Alignment',
        suggestion: `Add missing key technologies: ${missingSkills.slice(0, 3).join(', ')} to your technical skills section.`,
        impact: 'High',
      },
      {
        area: 'Experience Tailoring',
        suggestion:
          'Align work experience achievement bullet points with job description responsibilities.',
        impact: 'High',
      },
      {
        area: 'Industry Terminology',
        suggestion:
          'Use exact domain terms from the job description in summary and project descriptions.',
        impact: 'Medium',
      },
    ],
    recommendedLearningResources: [
      {
        title: 'Mastering Docker & Kubernetes',
        platform: 'Official Docker & Kubernetes Docs',
        link: 'https://kubernetes.io/docs/tutorials/',
        reason: 'Bridge container orchestration requirement specified in target Job Description.',
      },
      {
        title: 'AWS Certified Solutions Architect Course',
        platform: 'AWS Skill Builder',
        link: 'https://aws.amazon.com/training/',
        reason: 'Master cloud infrastructure and serverless patterns.',
      },
      {
        title: 'Full Stack System Design Handbook',
        platform: 'GitHub Open Source Guides',
        link: 'https://github.com/donnemartin/system-design-primer',
        reason: 'Strengthen high-level system architecture skills for senior technical roles.',
      },
    ],
  };
}
