import { renderEvaluationPrompt } from '../prompts/evaluation-prompt.loader';
import type { ZodType } from 'zod';

export async function runLlmEvaluation<TInput extends Record<string, unknown>, TOutput>(
  promptKey:
    'answer-evaluation' | 'communication' | 'star-framework' | 'hiring' | 'roadmap' | 'report',
  inputs: TInput,
  schema: ZodType<TOutput>,
  fallbackGenerator: (inputs: TInput) => TOutput
): Promise<{ data: TOutput; isFallback: boolean }> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  const { systemPrompt, userPrompt } = renderEvaluationPrompt(promptKey, inputs);

  if (geminiApiKey) {
    try {
      const res = await callGeminiApi<TOutput>(geminiApiKey, systemPrompt, userPrompt, schema);
      if (res) return { data: res, isFallback: false };
    } catch (err) {
      console.warn(
        `Gemini API evaluation call failed for ${promptKey}, using fallback engine:`,
        err
      );
    }
  }

  if (openAiApiKey) {
    try {
      const res = await callOpenAiApi<TOutput>(openAiApiKey, systemPrompt, userPrompt, schema);
      if (res) return { data: res, isFallback: false };
    } catch (err) {
      console.warn(
        `OpenAI API evaluation call failed for ${promptKey}, using fallback engine:`,
        err
      );
    }
  }

  return { data: fallbackGenerator(inputs), isFallback: true };
}

async function callGeminiApi<TOutput>(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  schema: ZodType<TOutput>
): Promise<TOutput | null> {
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

  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (textContent) {
    const parsed = JSON.parse(textContent);
    const validated = schema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
  }
  return null;
}

async function callOpenAiApi<TOutput>(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  schema: ZodType<TOutput>
): Promise<TOutput | null> {
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

  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (content) {
    const parsed = JSON.parse(content);
    const validated = schema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
  }
  return null;
}
