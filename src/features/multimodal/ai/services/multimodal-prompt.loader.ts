import * as fs from 'fs';
import * as path from 'path';

export interface MultimodalPromptMetadata {
  rawContent: string;
  objective: string;
  context: string;
  inputSchema: string;
  outputSchema: string;
  constraints: string[];
  failureHandling: string;
}

const PROMPT_DIR = path.join(process.cwd(), 'src/features/multimodal/ai/prompts');

const PROMPT_FILES = {
  'voice-interviewer': 'voice-interviewer.md',
  'live-coaching': 'live-coaching.md',
  'coding-hints': 'coding-hints.md',
  'practice-mode': 'practice-mode.md',
  'assessment-mode': 'assessment-mode.md',
} as const;

export type MultimodalPromptKey = keyof typeof PROMPT_FILES;

const PROMPT_CACHE: Partial<Record<MultimodalPromptKey, MultimodalPromptMetadata>> = {};

export function loadMultimodalPrompt(promptKey: MultimodalPromptKey): MultimodalPromptMetadata {
  if (PROMPT_CACHE[promptKey]) {
    return PROMPT_CACHE[promptKey]!;
  }

  const fileName = PROMPT_FILES[promptKey];
  const filePath = path.join(PROMPT_DIR, fileName);

  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = parsePromptMarkdown(rawContent);
    PROMPT_CACHE[promptKey] = parsed;
    return parsed;
  } catch (err) {
    console.error(`Failed to load multimodal prompt template: ${promptKey}`, err);
    return {
      rawContent: '',
      objective: 'Multimodal AI prompt',
      context: 'Default context',
      inputSchema: '{}',
      outputSchema: '{}',
      constraints: ['Output valid JSON'],
      failureHandling: 'Fallback engine',
    };
  }
}

function parsePromptMarkdown(markdown: string): MultimodalPromptMetadata {
  const objectiveMatch = markdown.match(/## Objective\s+([\s\S]*?)(?=## Context|$)/i);
  const contextMatch = markdown.match(/## Context\s+([\s\S]*?)(?=## Input Schema|$)/i);
  const inputSchemaMatch = markdown.match(/## Input Schema\s+```(?:json)?\s*([\s\S]*?)\s*```/i);
  const outputSchemaMatch = markdown.match(/## Output Schema\s+```(?:json)?\s*([\s\S]*?)\s*```/i);
  const constraintsMatch = markdown.match(/## Constraints\s+([\s\S]*?)(?=## Failure Handling|$)/i);
  const failureMatch = markdown.match(/## Failure Handling\s+([\s\S]*?)$/i);

  const constraints = constraintsMatch
    ? constraintsMatch[1]
        .split('\n')
        .map((line) => line.replace(/^-\s*/, '').trim())
        .filter(Boolean)
    : [];

  return {
    rawContent: markdown,
    objective: objectiveMatch ? objectiveMatch[1].trim() : '',
    context: contextMatch ? contextMatch[1].trim() : '',
    inputSchema: inputSchemaMatch ? inputSchemaMatch[1].trim() : '{}',
    outputSchema: outputSchemaMatch ? outputSchemaMatch[1].trim() : '{}',
    constraints,
    failureHandling: failureMatch ? failureMatch[1].trim() : '',
  };
}

export function renderMultimodalSystemPrompt(promptKey: MultimodalPromptKey): string {
  const meta = loadMultimodalPrompt(promptKey);
  return `OBJECTIVE:
${meta.objective}

CONTEXT:
${meta.context}

CONSTRAINTS:
${meta.constraints.map((c) => `- ${c}`).join('\n')}

EXPECTED OUTPUT FORMAT (JSON ONLY):
${meta.outputSchema}
`;
}
