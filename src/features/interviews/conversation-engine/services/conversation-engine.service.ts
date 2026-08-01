import { prisma } from '@/lib/prisma';
import type {
  QuestionCategory,
  QuestionDifficulty,
  QuestionBankItemData,
} from '../../question-bank/types/question-bank.types';
import { getQuestions } from '../../question-bank/services/question-bank.service';
import type {
  ConversationEngineState,
  InterviewMemoryState,
  InterviewPhase,
  InterviewTurnData,
  TurnSpeaker,
} from '../types/conversation-engine.types';
import {
  createInitialMemoryState,
  formatMemorySummary,
  updateMemoryState,
} from './interview-memory.service';
import { evaluateFollowUpStrategy } from './followup-strategy.service';
import { computeNextPhase } from './topic-progression.service';
import { runLlmInterviewerTurn } from '../pipeline/conversation-llm.provider';

// In-memory conversation state cache for offline/synthetic session resilience
const IN_MEMORY_CONVERSATIONS: Record<string, ConversationEngineState> = {};

export async function getConversationState(
  sessionId: string
): Promise<ConversationEngineState | null> {
  // If in-memory state exists and has active turns, prioritize it
  if (IN_MEMORY_CONVERSATIONS[sessionId] && IN_MEMORY_CONVERSATIONS[sessionId].turns.length > 0) {
    return IN_MEMORY_CONVERSATIONS[sessionId];
  }

  let session: Record<string, unknown> | null = null;
  try {
    session = (await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        turns: {
          orderBy: { turnIndex: 'asc' },
        },
      },
    })) as Record<string, unknown> | null;
  } catch (err) {
    console.warn('Prisma lookup failed for session, using fallback conversation engine:', err);
  }

  // Load question bank items matching focus areas / track / difficulty
  let questions: QuestionBankItemData[] = [];
  try {
    const questionsRes = await getQuestions({
      category:
        session?.track === 'full_loop'
          ? undefined
          : ((session?.track || 'technical') as QuestionCategory),
      difficulty: (session?.difficulty || 'medium') as QuestionDifficulty,
      limit: 5,
    });
    questions = questionsRes.items.length > 0 ? questionsRes.items : [];
  } catch {
    const seedQs = await getQuestions({});
    questions = seedQs.items;
  }

  if (!session) {
    if (!IN_MEMORY_CONVERSATIONS[sessionId]) {
      const fallbackMemory = createInitialMemoryState();
      const activeQ = questions[0] || null;

      IN_MEMORY_CONVERSATIONS[sessionId] = {
        sessionId,
        roleTitle: 'Senior Full Stack Engineer',
        seniorityLevel: 'senior',
        companyName: 'Nexoraa Tech',
        track: 'technical',
        difficulty: 'medium',
        adaptiveMode: true,
        phase: 'introduction',
        currentQuestionIndex: 0,
        activeQuestion: activeQ,
        questions,
        memory: fallbackMemory,
        turns: [],
        isCompleted: false,
      };
    }
    return IN_MEMORY_CONVERSATIONS[sessionId];
  }

  const rawTurns = (session.turns as Record<string, unknown>[]) || [];
  const turnDataList: InterviewTurnData[] = rawTurns.map((t) => ({
    id: String(t.id),
    sessionId: String(t.sessionId),
    turnIndex: Number(t.turnIndex),
    speaker: t.speaker as TurnSpeaker,
    messageText: String(t.messageText),
    questionId: (t.questionId as string) || null,
    phase: t.phase as InterviewPhase,
    topic: String(t.topic),
    difficulty: t.difficulty as QuestionDifficulty,
    metadata: (t.metadata as Record<string, unknown>) || undefined,
    createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
  }));

  // Reconstruct memory from turn metadata
  let memoryState: InterviewMemoryState = createInitialMemoryState();
  turnDataList.forEach((t) => {
    memoryState = updateMemoryState(memoryState, t);
  });

  const lastTurn = turnDataList[turnDataList.length - 1];
  const activeQuestionIndex = Math.min(
    lastTurn?.metadata?.followUpCount !== undefined && lastTurn.phase === 'topic_transition'
      ? Math.max(
          questions.findIndex((q) => q.id === lastTurn.questionId),
          0
        )
      : 0,
    Math.max(questions.length - 1, 0)
  );

  const activeQuestion = questions[activeQuestionIndex] || questions[0] || null;

  const constructedState: ConversationEngineState = {
    sessionId: String(session.id),
    roleTitle: String(session.roleTitle || 'Senior Engineer'),
    seniorityLevel: String(session.seniorityLevel || 'senior'),
    companyName: (session.companyName as string) || 'Target Company',
    track: String(session.track || 'technical'),
    difficulty: (session.difficulty as QuestionDifficulty) || 'medium',
    adaptiveMode: Boolean(session.adaptiveMode ?? true),
    phase: (lastTurn?.phase as InterviewPhase) || 'introduction',
    currentQuestionIndex: activeQuestionIndex,
    activeQuestion,
    questions,
    memory: memoryState,
    turns: turnDataList,
    isCompleted: session.status === 'completed' || lastTurn?.phase === 'wrap_up',
  };

  IN_MEMORY_CONVERSATIONS[sessionId] = constructedState;
  return constructedState;
}

export async function startConversation(sessionId: string): Promise<ConversationEngineState> {
  let currentState = await getConversationState(sessionId);
  if (!currentState) {
    throw new Error(`Interview session not found: ${sessionId}`);
  }

  if (currentState.turns.length > 0) {
    return currentState;
  }

  // Generate initial interviewer introduction turn
  const firstQuestion = currentState.questions[0];

  const introTurnResult = await runLlmInterviewerTurn({
    roleTitle: currentState.roleTitle,
    seniorityLevel: currentState.seniorityLevel,
    companyName: currentState.companyName,
    track: currentState.track,
    difficulty: currentState.difficulty,
    phase: 'introduction',
    currentQuestionTitle: firstQuestion?.title || 'System Warmup',
    currentQuestionPrompt: firstQuestion?.questionText || 'Let us begin.',
    idealAnswerOutline:
      firstQuestion?.evaluationMetadata.idealAnswerOutline || 'Introductory overview',
    recentTurnsSummary: 'Session starting.',
    candidateLastMessage: '',
    memoryBufferSummary: '',
    followUpCount: 0,
  });

  const introTurn: InterviewTurnData = {
    id: `turn-intro-${Date.now()}`,
    sessionId,
    turnIndex: 1,
    speaker: 'interviewer',
    messageText: introTurnResult.interviewerMessage,
    questionId: firstQuestion?.id || null,
    phase: 'introduction',
    topic: firstQuestion?.topic || 'Introduction',
    difficulty: currentState.difficulty,
    metadata: {
      suggestedQuickReplies: introTurnResult.suggestedQuickReplies || ["I'm ready! Let's start."],
      followUpCount: 0,
    },
    createdAt: new Date().toISOString(),
  };

  try {
    await prisma.interviewTurn.create({
      data: {
        sessionId,
        turnIndex: 1,
        speaker: 'interviewer',
        messageText: introTurnResult.interviewerMessage,
        questionId: firstQuestion?.id || null,
        phase: 'introduction',
        topic: firstQuestion?.topic || 'Introduction',
        difficulty: currentState.difficulty,
        metadata: {
          suggestedQuickReplies: introTurnResult.suggestedQuickReplies || [
            "I'm ready! Let's start.",
          ],
          followUpCount: 0,
        },
      },
    });

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: 'in_progress' },
    });
  } catch (dbErr) {
    console.warn('DB intro turn creation failed, using memory turn record:', dbErr);
  }

  currentState = {
    ...currentState,
    phase: 'introduction',
    turns: [introTurn],
  };

  IN_MEMORY_CONVERSATIONS[sessionId] = currentState;
  return currentState;
}

export async function processCandidateTurn(
  sessionId: string,
  candidateMessage: string
): Promise<ConversationEngineState> {
  const state = await getConversationState(sessionId);
  if (!state) {
    throw new Error(`Interview session not found: ${sessionId}`);
  }

  if (state.isCompleted) {
    return state;
  }

  const nextTurnIndex = state.turns.length + 1;
  const activeQ = state.activeQuestion || state.questions[0];

  const candidateTurn: InterviewTurnData = {
    id: `turn-cand-${Date.now()}`,
    sessionId,
    turnIndex: nextTurnIndex,
    speaker: 'candidate',
    messageText: candidateMessage.trim(),
    questionId: activeQ?.id || null,
    phase: state.phase,
    topic: activeQ?.topic || 'General',
    difficulty: state.difficulty,
    metadata: {
      followUpCount: state.memory.currentFollowUpCount,
    },
    createdAt: new Date().toISOString(),
  };

  try {
    await prisma.interviewTurn.create({
      data: {
        sessionId,
        turnIndex: nextTurnIndex,
        speaker: 'candidate',
        messageText: candidateMessage.trim(),
        questionId: activeQ?.id || null,
        phase: state.phase,
        topic: activeQ?.topic || 'General',
        difficulty: state.difficulty,
        metadata: {
          followUpCount: state.memory.currentFollowUpCount,
        },
      },
    });
  } catch (dbErr) {
    console.warn('DB candidate turn creation failed, storing in memory:', dbErr);
  }

  const updatedTurns = [...state.turns, candidateTurn];
  let updatedMemory = state.memory;
  updatedMemory = updateMemoryState(updatedMemory, candidateTurn);

  const updatedStateAfterCandidateTurn: ConversationEngineState = {
    ...state,
    turns: updatedTurns,
    memory: updatedMemory,
  };

  // Evaluate Strategy Decision
  const decision = evaluateFollowUpStrategy(updatedStateAfterCandidateTurn, candidateMessage);

  // Compute Next Phase & Active Question
  const { nextPhase, activeQuestion } = computeNextPhase(
    updatedStateAfterCandidateTurn,
    decision.action
  );

  const targetQ = activeQuestion || activeQ;
  const isFollowUp = decision.action === 'ask_followup';
  const newFollowUpCount = isFollowUp
    ? updatedStateAfterCandidateTurn.memory.currentFollowUpCount + 1
    : 0;

  const recentTurnsSummary = updatedStateAfterCandidateTurn.turns
    .slice(-4)
    .map((t) => `${t.speaker.toUpperCase()}: ${t.messageText}`)
    .join('\n');

  const memorySummary = formatMemorySummary(updatedStateAfterCandidateTurn.memory);

  // Run LLM Interviewer Turn Generation
  const interviewerTurnResult = await runLlmInterviewerTurn({
    roleTitle: state.roleTitle,
    seniorityLevel: state.seniorityLevel,
    companyName: state.companyName,
    track: state.track,
    difficulty: decision.nextDifficulty || state.difficulty,
    phase: nextPhase,
    currentQuestionTitle: targetQ?.title || 'Technical Question',
    currentQuestionPrompt: targetQ?.questionText || 'Explain your technical approach.',
    idealAnswerOutline: targetQ?.evaluationMetadata?.idealAnswerOutline || '',
    recentTurnsSummary,
    candidateLastMessage: candidateMessage,
    memoryBufferSummary: memorySummary,
    followUpCount: newFollowUpCount,
  });

  const interviewerTurn: InterviewTurnData = {
    id: `turn-interviewer-${Date.now()}`,
    sessionId,
    turnIndex: nextTurnIndex + 1,
    speaker: 'interviewer',
    messageText: interviewerTurnResult.interviewerMessage,
    questionId: targetQ?.id || null,
    phase: nextPhase,
    topic: targetQ?.topic || 'General',
    difficulty: decision.nextDifficulty || state.difficulty,
    metadata: {
      extractedStrength: interviewerTurnResult.memoryNotes?.extractedStrength,
      extractedGap: interviewerTurnResult.memoryNotes?.extractedGap,
      mentionedExperience: interviewerTurnResult.memoryNotes?.mentionedExperience,
      suggestedQuickReplies: interviewerTurnResult.suggestedQuickReplies,
      followUpCount: newFollowUpCount,
    },
    createdAt: new Date().toISOString(),
  };

  try {
    await prisma.interviewTurn.create({
      data: {
        sessionId,
        turnIndex: nextTurnIndex + 1,
        speaker: 'interviewer',
        messageText: interviewerTurnResult.interviewerMessage,
        questionId: targetQ?.id || null,
        phase: nextPhase,
        topic: targetQ?.topic || 'General',
        difficulty: decision.nextDifficulty || state.difficulty,
        metadata: {
          extractedStrength: interviewerTurnResult.memoryNotes?.extractedStrength,
          extractedGap: interviewerTurnResult.memoryNotes?.extractedGap,
          mentionedExperience: interviewerTurnResult.memoryNotes?.mentionedExperience,
          suggestedQuickReplies: interviewerTurnResult.suggestedQuickReplies,
          followUpCount: newFollowUpCount,
        },
      },
    });

    if (nextPhase === 'wrap_up') {
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: { status: 'completed' },
      });
    }
  } catch (dbErr) {
    console.warn('DB interviewer turn creation failed, storing in memory:', dbErr);
  }

  const finalTurns = [...updatedTurns, interviewerTurn];
  let finalMemory = updatedMemory;
  finalMemory = updateMemoryState(finalMemory, interviewerTurn);

  const finalState: ConversationEngineState = {
    ...state,
    phase: nextPhase,
    activeQuestion: targetQ,
    memory: finalMemory,
    turns: finalTurns,
    isCompleted: nextPhase === 'wrap_up',
  };

  IN_MEMORY_CONVERSATIONS[sessionId] = finalState;
  return finalState;
}
