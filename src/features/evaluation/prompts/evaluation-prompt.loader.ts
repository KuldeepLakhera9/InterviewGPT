import fs from 'fs';
import path from 'path';

export interface EvaluationPromptMetadata {
  id: string;
  filename: string;
  rawText: string;
  objective: string;
  constraints: string[];
}

const PROMPTS_DIR = path.join(process.cwd(), 'src/features/evaluation/ai/prompts');

const PROMPT_FILES: Record<string, string> = {
  'answer-evaluation': 'answer-evaluation.md',
  communication: 'communication.md',
  'star-framework': 'star-framework.md',
  hiring: 'hiring.md',
  roadmap: 'roadmap.md',
  report: 'report.md',
};

const PROMPT_CACHE: Record<string, EvaluationPromptMetadata> = {};

export function loadEvaluationPrompt(
  promptKey: keyof typeof PROMPT_FILES
): EvaluationPromptMetadata {
  if (PROMPT_CACHE[promptKey]) {
    return PROMPT_CACHE[promptKey];
  }

  const filename = PROMPT_FILES[promptKey];
  if (!filename) {
    throw new Error(`Unknown evaluation prompt key: ${promptKey}`);
  }

  const filePath = path.join(PROMPTS_DIR, filename);
  let rawText = '';
  try {
    rawText = fs.readFileSync(filePath, 'utf-8');
  } catch {
    rawText = `# ${promptKey}\n\nObjective: Evaluate ${promptKey}\n\nReturn structured JSON output matching domain schema.`;
  }

  const objectiveMatch = rawText.match(/## Objective\n([\s\S]*?)(?=\n##|$)/);
  const objective = objectiveMatch ? objectiveMatch[1].trim() : `Evaluate ${promptKey}`;

  const constraintsMatch = rawText.match(/## Constraints\n([\s\S]*?)(?=\n##|$)/);
  const constraints = constraintsMatch
    ? constraintsMatch[1]
        .split('\n')
        .map((l) => l.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean)
    : ['Return valid structured JSON matching output schema strictly.'];

  const metadata: EvaluationPromptMetadata = {
    id: promptKey,
    filename,
    rawText,
    objective,
    constraints,
  };

  PROMPT_CACHE[promptKey] = metadata;
  return metadata;
}

export function renderEvaluationPrompt<TInput extends Record<string, unknown>>(
  promptKey: keyof typeof PROMPT_FILES,
  inputs: TInput
): { systemPrompt: string; userPrompt: string } {
  const promptMeta = loadEvaluationPrompt(promptKey);

  const systemPrompt = `You are the Principal Interview Evaluation AI Engine for InterviewGPT.\nObjective: ${
    promptMeta.objective
  }\n\nCRITICAL CONSTRAINTS:\n${promptMeta.constraints
    .map((c) => `- ${c}`)
    .join('\n')}\n\nALWAYS return strict raw JSON without Markdown backticks (\`\`\`json).`;

  const userPrompt = `EVALUATION INPUT PAYLOAD:\n${JSON.stringify(
    inputs,
    null,
    2
  )}\n\nProcess the input according to the evaluation rules and return the complete structured JSON scorecard object.`;

  return { systemPrompt, userPrompt };
}
