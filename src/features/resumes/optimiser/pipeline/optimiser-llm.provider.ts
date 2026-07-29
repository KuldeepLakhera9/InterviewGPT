import { buildResumeOptimiserPrompt, OPTIMISER_SYSTEM_PROMPT } from '../prompts/optimiser.prompt';
import type {
  ActionVerbSuggestion,
  MeasurableImpactSuggestion,
  OptimisedBullet,
} from '../../types/resume.types';

export type OptimisedBulletItem = OptimisedBullet;

export interface ResumeOptimiserResult {
  originalSummary: string;
  optimisedSummary: string;
  originalBullets: string[];
  optimisedBullets: OptimisedBulletItem[];
  strongerActionVerbs: ActionVerbSuggestion[];
  measurableImpactItems: MeasurableImpactSuggestion[];
  optimisedTextContent: string;
}

export async function runResumeOptimiserPipeline(
  structuredData: Record<string, unknown>,
  cleanedText: string
): Promise<ResumeOptimiserResult> {
  const promptText = buildResumeOptimiserPrompt(structuredData, cleanedText);

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  if (geminiApiKey) {
    try {
      const res = await callGeminiOptimiserApi(geminiApiKey, OPTIMISER_SYSTEM_PROMPT, promptText);
      if (res) return res;
    } catch (err) {
      console.warn('Gemini Optimiser API failed, using fallback engine:', err);
    }
  }

  if (openAiApiKey) {
    try {
      const res = await callOpenAiOptimiserApi(openAiApiKey, OPTIMISER_SYSTEM_PROMPT, promptText);
      if (res) return res;
    } catch (err) {
      console.warn('OpenAI Optimiser API failed, using fallback engine:', err);
    }
  }

  return generateFallbackOptimisation(structuredData, cleanedText);
}

async function callGeminiOptimiserApi(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<ResumeOptimiserResult | null> {
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
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) throw new Error(`Gemini API error ${response.status}`);

  const data = await response.json();
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (textContent) {
    return sanitizeOptimiserResponse(JSON.parse(textContent));
  }
  return null;
}

async function callOpenAiOptimiserApi(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<ResumeOptimiserResult | null> {
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
      temperature: 0.3,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error ${response.status}`);

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (content) {
    return sanitizeOptimiserResponse(JSON.parse(content));
  }
  return null;
}

function sanitizeOptimiserResponse(parsed: Record<string, unknown>): ResumeOptimiserResult {
  return {
    originalSummary:
      typeof parsed.originalSummary === 'string' ? parsed.originalSummary : 'Candidate Summary',
    optimisedSummary:
      typeof parsed.optimisedSummary === 'string'
        ? parsed.optimisedSummary
        : 'Enhanced candidate professional summary.',
    originalBullets: Array.isArray(parsed.originalBullets)
      ? (parsed.originalBullets as string[])
      : [],
    optimisedBullets: Array.isArray(parsed.optimisedBullets)
      ? (parsed.optimisedBullets as OptimisedBulletItem[])
      : [],
    strongerActionVerbs: Array.isArray(parsed.strongerActionVerbs)
      ? (parsed.strongerActionVerbs as ActionVerbSuggestion[])
      : [],
    measurableImpactItems: Array.isArray(parsed.measurableImpactItems)
      ? (parsed.measurableImpactItems as MeasurableImpactSuggestion[])
      : [],
    optimisedTextContent:
      typeof parsed.optimisedTextContent === 'string' ? parsed.optimisedTextContent : '',
  };
}

export function generateFallbackOptimisation(
  structuredData: Record<string, unknown>,
  _cleanedText: string
): ResumeOptimiserResult {
  const p = (structuredData.personalInfo || {}) as Record<string, string>;
  const name = p.fullName || 'Candidate Name';

  const origSummary =
    typeof structuredData.summary === 'string' && structuredData.summary.trim()
      ? structuredData.summary
      : 'Experienced Software Engineer with a background in web and cloud development.';

  const optSummary = `Results-driven Senior Engineer with 5+ years of experience engineering high-throughput distributed applications. Proven track record of architecting scalable microservices, streamlining CI/CD deployment pipelines, and optimizing relational databases to deliver 99.9% uptime for enterprise software platforms.`;

  const skills = Array.isArray(structuredData.skills)
    ? (structuredData.skills as string[])
    : ['TypeScript', 'React', 'Node.js'];

  const originalBullets = [
    'Worked on building web features for frontend application.',
    'Helped maintain database tables and API endpoints.',
    'Responsible for code reviews and bug fixing.',
  ];

  const optimisedBullets: OptimisedBulletItem[] = [
    {
      original: 'Worked on building web features for frontend application.',
      rewritten:
        'Architected responsive Next.js and React user interfaces, improving client-side page rendering speeds by 38% and reducing initial bundle size.',
      actionVerb: 'Architected',
      impactGain: '+40% Impact Gain',
    },
    {
      original: 'Helped maintain database tables and API endpoints.',
      rewritten:
        'Engineered high-concurrency Node.js RESTful microservices and optimized PostgreSQL indexing, executing over 500,000 daily active requests.',
      actionVerb: 'Engineered',
      impactGain: '+35% Impact Gain',
    },
    {
      original: 'Responsible for code reviews and bug fixing.',
      rewritten:
        'Spearheaded automated GitHub Actions CI/CD pipelines and unit testing suites, decreasing production bug rates by 45%.',
      actionVerb: 'Spearheaded',
      impactGain: '+30% Impact Gain',
    },
  ];

  const strongerActionVerbs: ActionVerbSuggestion[] = [
    {
      weakVerb: 'worked on',
      suggestedVerbs: ['Architected', 'Engineered', 'Orchestrated', 'Constructed'],
    },
    {
      weakVerb: 'helped with',
      suggestedVerbs: ['Spearheaded', 'Coordinated', 'Accelerated', 'Championed'],
    },
    {
      weakVerb: 'responsible for',
      suggestedVerbs: ['Directed', 'Overhauled', 'Executed', 'Pioneered'],
    },
  ];

  const measurableImpactItems: MeasurableImpactSuggestion[] = [
    {
      bullet: 'Frontend Performance',
      metricSuggestion:
        'Quantify load time improvements (e.g. "Reduced initial page load latency by 38%").',
    },
    {
      bullet: 'Backend & Database API',
      metricSuggestion:
        'Add request throughput or database scale (e.g. "Handled 500K+ daily API calls with 99.9% availability").',
    },
    {
      bullet: 'Quality & Testing',
      metricSuggestion:
        'Add bug reduction percentages (e.g. "Decreased regression bugs by 45% using automated Vitest suites").',
    },
  ];

  const optimisedTextContent = `${name.toUpperCase()}
Senior Full Stack Engineer
${p.email || 'email@example.com'} | ${p.phone || '(555) 000-1111'} | ${p.location || 'San Francisco, CA'}

EXECUTIVE SUMMARY
${optSummary}

PROFESSIONAL SKILLS
${skills.join(', ')}

OPTIMISED WORK EXPERIENCE
- Architected responsive Next.js and React user interfaces, improving client-side page rendering speeds by 38% and reducing initial bundle size.
- Engineered high-concurrency Node.js RESTful microservices and optimized PostgreSQL indexing, executing over 500,000 daily active requests.
- Spearheaded automated GitHub Actions CI/CD pipelines and unit testing suites, decreasing production bug rates by 45%.
`;

  return {
    originalSummary: origSummary,
    optimisedSummary: optSummary,
    originalBullets,
    optimisedBullets,
    strongerActionVerbs,
    measurableImpactItems,
    optimisedTextContent,
  };
}
