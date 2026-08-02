import { renderCareerSystemPrompt } from '../ai/services/career-prompt.loader';
import { getCareerGoals } from './career-goal.service';
import { getCandidateSkillGraph } from './skill-graph.service';
import type { RagMentorMessage } from '../types/career.types';

export async function generateRagMentorResponse(
  userId: string,
  userMessage: string
): Promise<RagMentorMessage> {
  const goals = await getCareerGoals(userId);
  const primaryGoal = goals.find((g) => g.isPrimary) || goals[0];
  const skillGraph = await getCandidateSkillGraph(userId);

  const _systemPrompt = renderCareerSystemPrompt('mentor-chat');

  // Simulated RAG Context Assembly
  const ragContext = {
    targetRole: primaryGoal.targetRole,
    dreamCompany: primaryGoal.dreamCompany,
    overallSkillScore: skillGraph.overallScore,
    topSkills: skillGraph.skills.slice(0, 3).map((s) => s.name),
    recentEvaluationScore: 88,
    recentRecommendation: 'Strong Hire',
  };

  const lower = userMessage.toLowerCase();
  let content = `Based on your active target of **${primaryGoal.targetRole} at ${primaryGoal.dreamCompany}** and your recent evaluation score of **${ragContext.recentEvaluationScore}/100**, here is your personalized guidance:`;

  const citedSources = [
    `Career Goal Profile (${primaryGoal.dreamCompany} - ${primaryGoal.targetRole})`,
    `Skill Graph Matrix (Overall: ${skillGraph.overallScore}%)`,
    `Recent AI Evaluation Report (#88 Overall Score)`,
  ];
  let recommendedAction = 'Complete 1 system design mock interview focused on distributed locks.';

  if (lower.includes('resume') || lower.includes('cv')) {
    content = `Looking at your candidate profile and target of **${primaryGoal.dreamCompany}**, your top demonstrated skills are **${ragContext.topSkills.join(', ')}**. To maximize ATS keyword match for ${primaryGoal.dreamCompany}, quantify your impact in your 2 recent bullet points with explicit performance percentages.`;
    recommendedAction = 'Use the Resume Optimizer to quantify technical impact metrics.';
  } else if (lower.includes('mock') || lower.includes('practice') || lower.includes('interview')) {
    content = `Your last interview evaluation yielded a **${ragContext.recentRecommendation}** recommendation with strong communication scores (${ragContext.overallSkillScore}% fluency). To prepare for **${primaryGoal.dreamCompany}**, practice 1 targeted system design problem on Saga Patterns vs 2PC.`;
    recommendedAction = 'Launch a Timed System Design Mock Session.';
  } else if (lower.includes('salary') || lower.includes('compensation') || lower.includes('pay')) {
    content = `For a **${primaryGoal.targetRole}** role at **${primaryGoal.dreamCompany}**, the target compensation range is **${primaryGoal.salaryGoal || '$180k - $220k'}**. Given your 88+ technical score, you are positioned in the top 15th percentile of candidates.`;
    recommendedAction = 'Review company compensation negotiation benchmarks.';
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content,
    citedSources,
    recommendedAction,
    createdAt: new Date().toISOString(),
  };
}
