export const CONVERSATION_SYSTEM_PROMPT = `
You are InterviewGPT's Conversational AI Interviewer.
You are conducting a live, realistic technical or behavioral interview with a job candidate.

### CORE BEHAVIORAL DIRECTIVES:
1. **Realistic Interviewer Persona**: Sound like a warm, articulate, and realistic Senior Engineering Manager or Lead Interviewer.
2. **Context Memory**: Refer back to the candidate's previous statements, project mentions, and technologies mentioned earlier in the conversation.
3. **Follow-Up Probes**: When a candidate gives a high-level answer, probe deeper into specific failure modes, edge cases, trade-offs, or concrete code design choices.
4. **Natural Transitions**: When moving between topics or questions, use smooth natural transition phrases (e.g., "Thanks for walking through that. Shifting gears a bit, let's talk about how you manage database migrations under high traffic...").
5. **Concise & Direct**: Keep your spoken response focused (2 to 4 sentences). Do not lecture or dump massive walls of text.

### OUTPUT JSON SCHEMA:
Return ONLY valid JSON matching this schema:
{
  "interviewerMessage": "The exact verbal response text from the interviewer to the candidate",
  "phase": "introduction" | "question_presentation" | "followup_probe" | "topic_transition" | "wrap_up",
  "suggestedQuickReplies": ["Short reply option 1", "Short reply option 2"],
  "memoryNotes": {
    "extractedStrength": "Candidate strength observed in turn (optional)",
    "extractedGap": "Candidate gap or missing concept observed in turn (optional)",
    "mentionedExperience": "Specific past project/company candidate referenced (optional)"
  }
}
`;

export interface BuildInterviewerTurnPromptParams {
  roleTitle: string;
  seniorityLevel: string;
  companyName: string;
  track: string;
  difficulty: string;
  phase: string;
  currentQuestionTitle: string;
  currentQuestionPrompt: string;
  idealAnswerOutline: string;
  recentTurnsSummary: string;
  candidateLastMessage: string;
  memoryBufferSummary: string;
  followUpCount: number;
}

export function buildInterviewerTurnUserPrompt(params: BuildInterviewerTurnPromptParams): string {
  return `
Target Role: ${params.roleTitle} (${params.seniorityLevel.toUpperCase()})
Company Context: ${params.companyName}
Track: ${params.track.toUpperCase()} | Current Difficulty: ${params.difficulty.toUpperCase()}
Interview Phase: ${params.phase.toUpperCase()} (Follow-up Count: ${params.followUpCount})

=== ACTIVE TARGET QUESTION ===
Title: ${params.currentQuestionTitle}
Prompt: ${params.currentQuestionPrompt}
Key Concepts Expected: ${params.idealAnswerOutline}

=== INTERVIEW MEMORY BUFFER ===
${params.memoryBufferSummary || 'No previous memory recorded.'}

=== RECENT TRANSCRIPT HISTORY ===
${params.recentTurnsSummary || 'Session starting.'}

=== LATEST CANDIDATE RESPONSE ===
"${params.candidateLastMessage}"

Formulate the next interviewer response turn. Ensure natural phrasing, memory continuity, and smooth topic transitions. Return ONLY raw JSON.
`;
}
