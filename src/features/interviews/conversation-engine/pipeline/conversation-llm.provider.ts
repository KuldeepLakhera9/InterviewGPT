import { renderPromptText } from '../../prompt-library/services/prompt-library.service';
import { CONVERSATION_SYSTEM_PROMPT } from '../prompts/conversation-engine.prompt';
import type { InterviewerTurnResult, InterviewPhase } from '../types/conversation-engine.types';

export interface RunInterviewerTurnInput {
  roleTitle: string;
  seniorityLevel: string;
  companyName: string;
  track: string;
  difficulty: string;
  phase: InterviewPhase;
  currentQuestionTitle: string;
  currentQuestionPrompt: string;
  idealAnswerOutline: string;
  recentTurnsSummary: string;
  candidateLastMessage: string;
  memoryBufferSummary: string;
  followUpCount: number;
}

export async function runLlmInterviewerTurn(
  input: RunInterviewerTurnInput
): Promise<InterviewerTurnResult> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  // Retrieve user prompt via Prompt Library Service based on interview track
  let userPrompt = '';
  try {
    const promptId =
      input.track === 'system_design'
        ? 'prompt_system_design_interviewer_v1'
        : input.track === 'behavioral'
          ? 'prompt_behavioral_interviewer_v1'
          : 'prompt_technical_interviewer_v1';

    userPrompt = renderPromptText(promptId, {
      roleTitle: input.roleTitle,
      seniorityLevel: input.seniorityLevel,
      companyTier: 'faang',
      difficulty: input.difficulty,
      questionTitle: input.currentQuestionTitle,
      questionText: input.currentQuestionPrompt,
      candidateResponse: input.candidateLastMessage || 'Hello',
      topicsCovered: [],
    });
  } catch {
    userPrompt = `Evaluate candidate response for ${input.roleTitle} (${input.seniorityLevel}). Question: ${input.currentQuestionTitle}. Candidate response: "${input.candidateLastMessage}".`;
  }

  if (geminiApiKey) {
    try {
      const res = await callGeminiConversationApi(
        geminiApiKey,
        CONVERSATION_SYSTEM_PROMPT,
        userPrompt
      );
      if (res) return { ...res, isFallback: false };
    } catch (err) {
      console.warn('Gemini API call failed for conversation turn, using fallback engine:', err);
    }
  }

  if (openAiApiKey) {
    try {
      const res = await callOpenAiConversationApi(
        openAiApiKey,
        CONVERSATION_SYSTEM_PROMPT,
        userPrompt
      );
      if (res) return { ...res, isFallback: false };
    } catch (err) {
      console.warn('OpenAI API call failed for conversation turn, using fallback engine:', err);
    }
  }

  return { ...generateFallbackInterviewerTurn(input), isFallback: true };
}

async function callGeminiConversationApi(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<InterviewerTurnResult | null> {
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

  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (textContent) {
    const parsed = JSON.parse(textContent);
    return {
      interviewerMessage:
        parsed.interviewerMessage || 'Could you elaborate further on your approach?',
      phase: (parsed.phase as InterviewPhase) || 'followup_probe',
      suggestedQuickReplies: Array.isArray(parsed.suggestedQuickReplies)
        ? (parsed.suggestedQuickReplies as string[])
        : undefined,
      memoryNotes: parsed.memoryNotes || undefined,
    };
  }
  return null;
}

async function callOpenAiConversationApi(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<InterviewerTurnResult | null> {
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

  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (content) {
    const parsed = JSON.parse(content);
    return {
      interviewerMessage:
        parsed.interviewerMessage || 'Could you elaborate further on your approach?',
      phase: (parsed.phase as InterviewPhase) || 'followup_probe',
      suggestedQuickReplies: Array.isArray(parsed.suggestedQuickReplies)
        ? (parsed.suggestedQuickReplies as string[])
        : undefined,
      memoryNotes: parsed.memoryNotes || undefined,
    };
  }
  return null;
}

export function generateFallbackInterviewerTurn(
  input: RunInterviewerTurnInput
): InterviewerTurnResult {
  if (input.phase === 'introduction') {
    return {
      interviewerMessage: `Welcome! I'm your AI Lead Interviewer for the ${input.seniorityLevel.toUpperCase()} ${input.roleTitle} role at ${input.companyName}. We'll cover technical system design and problem-solving questions. Ready to dive in?`,
      phase: 'introduction',
      suggestedQuickReplies: ["I'm ready! Let's start.", 'Tell me more about the structure first.'],
      memoryNotes: {
        mentionedExperience: `Targeting ${input.companyName} as ${input.roleTitle}`,
      },
    };
  }

  if (input.phase === 'wrap_up') {
    return {
      interviewerMessage: `Thank you for working through those scenarios! That wraps up our technical interview session for ${input.companyName}. Great job navigating the trade-offs and architectural edge cases.`,
      phase: 'wrap_up',
      suggestedQuickReplies: ['Thank you! Excited to view evaluation feedback.'],
      memoryNotes: {
        extractedStrength: 'Demonstrated complete perseverance through all questions',
      },
    };
  }

  if (input.phase === 'topic_transition') {
    return {
      interviewerMessage: `Thanks for walking through that topic. Shifting gears, let's look at ${input.currentQuestionTitle}. ${input.currentQuestionPrompt}`,
      phase: 'topic_transition',
      suggestedQuickReplies: [
        'Here is how I would approach that...',
        'Let me clarify the core requirements first.',
      ],
      memoryNotes: {
        extractedStrength: 'Smooth topic transition handling',
      },
    };
  }

  if (input.phase === 'followup_probe') {
    return {
      interviewerMessage: `That makes sense regarding your initial design. How do you handle high-traffic failure modes or edge cases when database latency spikes under load?`,
      phase: 'followup_probe',
      suggestedQuickReplies: [
        'I would implement circuit breakers and fallback caches.',
        'We can use read replicas and connection pooling.',
      ],
      memoryNotes: {
        extractedStrength: 'Recognizes system bottleneck challenges',
      },
    };
  }

  // Default question presentation
  return {
    interviewerMessage: `Let's tackle this next scenario: ${input.currentQuestionPrompt}`,
    phase: 'question_presentation',
    suggestedQuickReplies: [
      'My first step is to establish requirements and metrics.',
      'I will start by laying out the high-level architecture.',
    ],
  };
}
