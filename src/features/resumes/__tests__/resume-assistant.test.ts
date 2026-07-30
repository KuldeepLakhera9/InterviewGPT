import { describe, expect, it } from 'vitest';
import { buildAssistantPrompt } from '../assistant/prompts/assistant.prompt';
import { generateFallbackAssistantResponse } from '../assistant/pipeline/assistant-llm.provider';
import type { ContextChunk } from '../assistant/rag/resume-rag.retriever';

describe('Resume AI Assistant - Separate Prompt Template & RAG', () => {
  it('should construct prompt with retrieved RAG context chunks and conversation history', () => {
    const chunks: ContextChunk[] = [
      {
        source: 'AtsAnalysis',
        title: 'ATS Scores',
        snippet: 'ATS Score: 82/100. Recruiter Score: 78/100.',
      },
    ];
    const history = [
      { role: 'user', content: 'Hi assistant' },
      { role: 'assistant', content: 'Hello!' },
    ];
    const query = 'Explain my ATS score';

    const prompt = buildAssistantPrompt(chunks, history, query);

    expect(prompt).toContain('RETRIEVED RAG RESUME CONTEXT CHUNKS');
    expect(prompt).toContain('ATS Scores');
    expect(prompt).toContain('Explain my ATS score');
  });
});

describe('Resume AI Assistant - RAG Capabilities & Explanations', () => {
  const chunks: ContextChunk[] = [
    {
      source: 'AtsAnalysis',
      title: 'ATS Scores',
      snippet: 'ATS Score: 82/100. Recruiter Score: 78/100.',
    },
    { source: 'ParsedResume', title: 'Skills', snippet: 'TypeScript, React, Node.js' },
  ];

  it('should explain ATS score', () => {
    const res = generateFallbackAssistantResponse(chunks, 'Explain my ATS score');
    expect(res).toContain('ATS Score Analysis Breakdown');
    expect(res).toContain('82 / 100');
  });

  it('should explain weaknesses and formatting issues', () => {
    const res = generateFallbackAssistantResponse(chunks, 'Why is my experience section weak?');
    expect(res).toContain('Resume Weaknesses & Fixes');
    expect(res).toContain('Passive Action Verbs');
  });

  it('should explain recruiter feedback', () => {
    const res = generateFallbackAssistantResponse(chunks, 'Explain recruiter feedback');
    expect(res).toContain('Recruiter Feedback & First Impressions');
  });

  it('should recommend actionable improvements', () => {
    const res = generateFallbackAssistantResponse(chunks, 'Recommend high-impact improvements');
    expect(res).toContain('Actionable Resume Recommendations');
  });

  it('should NOT generate interview questions or interview practice scripts', () => {
    const res = generateFallbackAssistantResponse(chunks, 'Tell me about my resume');
    expect(res.toLowerCase()).not.toContain('mock interview');
    expect(res.toLowerCase()).not.toContain('practice question');
  });
});
