import type { ContextChunk } from '../rag/resume-rag.retriever';

export const ASSISTANT_SYSTEM_PROMPT = `
You are an expert AI Career Coach and Resume Specialist assisting candidate job seekers.

Your capabilities include:
1. Explaining the candidate's ATS (Applicant Tracking System) Readability Score and Recruiter Impression Score.
2. Explaining weaknesses identified in the resume (e.g. passive phrasing, formatting warnings, missing keywords).
3. Recommending actionable, high-impact resume improvements.
4. Answering specific questions regarding candidate skills, experience, formatting, or career positioning.
5. Explaining recruiter feedback and recruitment evaluation criteria.

CRITICAL INSTRUCTIONS & CONSTRAINTS:
- Answer candidate questions strictly using the retrieved RAG Context Chunks provided in the prompt.
- Do NOT perform mock interviews or generate practice interview questions. Focus exclusively on resume analysis and optimization.
- Be encouraging, articulate, clear, and actionable in your guidance. Use markdown formatting with bullet points and bold highlights for readability.
`;

export function buildAssistantPrompt(
  contextChunks: ContextChunk[],
  conversationHistory: Array<{ role: string; content: string }>,
  userQuery: string
): string {
  const chunksText = contextChunks
    .map((c) => `[SOURCE: ${c.source} | ${c.title}]\n${c.snippet}`)
    .join('\n\n');

  const historyText = conversationHistory
    .slice(-6)
    .map((h) => `${h.role.toUpperCase()}: ${h.content}`)
    .join('\n');

  return `
[RETRIEVED RAG RESUME CONTEXT CHUNKS]
${chunksText || 'No specific context chunks retrieved.'}

[RECENT CONVERSATION HISTORY]
${historyText || 'No previous history.'}

[CANDIDATE USER QUESTION]
${userQuery}

Provide a helpful, detailed, and actionable response addressing the candidate's question based on their parsed resume data and ATS analysis reports:
`;
}
