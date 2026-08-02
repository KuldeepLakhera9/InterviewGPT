import { describe, it, expect } from 'vitest';
import { loadCareerPrompt, renderCareerSystemPrompt } from '../ai/services/career-prompt.loader';
import { getDefaultSkillGraph } from '../services/skill-graph.service';
import { computeSkillGapAnalysis } from '../services/skill-gap.service';
import { getDefaultPersonalizedRoadmap } from '../services/learning-roadmap.service';
import { getDefaultLearningHubItems } from '../services/learning-hub.service';
import { getDefaultDailyCoachStreak } from '../services/daily-coach.service';
import { getCompanyPrepPacks } from '../services/company-prep.service';
import { generateRagMentorResponse } from '../services/mentor-chat.service';
import { getDefaultGamificationData } from '../services/gamification.service';
import { getDefaultNotifications } from '../services/notification.service';
import { createCareerGoalSchema } from '../validators/career.validators';

describe('Phase 7: AI Career Coach & Learning Intelligence Domain Suite', () => {
  it('should load version-controlled prompt templates from markdown', () => {
    const roadmapPrompt = loadCareerPrompt('career-roadmap');
    expect(roadmapPrompt.objective).toBeTruthy();
    expect(roadmapPrompt.constraints.length).toBeGreaterThan(0);

    const systemPromptStr = renderCareerSystemPrompt('mentor-chat');
    expect(systemPromptStr).toContain('OBJECTIVE:');
    expect(systemPromptStr).toContain('CONSTRAINTS:');
  });

  it('should validate career goal Zod schema', () => {
    const validGoal = {
      dreamCompany: 'Google',
      targetRole: 'Senior Full Stack Engineer',
      experienceLevel: 'Senior',
      salaryGoal: '$200,000',
      targetTimeline: '3 Months',
      isPrimary: true,
    };
    const result = createCareerGoalSchema.safeParse(validGoal);
    expect(result.success).toBe(true);
  });

  it('should compute living skill graph and skill gap analysis correctly', () => {
    const skillGraph = getDefaultSkillGraph();
    expect(skillGraph.skills.length).toBeGreaterThan(5);
    expect(skillGraph.overallScore).toBeGreaterThan(50);

    const gapAnalysis = computeSkillGapAnalysis(skillGraph, 'Senior Full Stack Engineer');
    expect(gapAnalysis.missingSkills.length).toBeGreaterThan(0);
    expect(gapAnalysis.weakSkills.length).toBeGreaterThan(0);
    expect(gapAnalysis.overallReadinessPercentage).toBeGreaterThan(0);
  });

  it('should generate personalized multi-tier roadmaps', () => {
    const roadmap = getDefaultPersonalizedRoadmap('Senior Staff Engineer');
    expect(roadmap.targetRole).toBe('Senior Staff Engineer');
    expect(roadmap.dailyPlan.length).toBeGreaterThan(0);
    expect(roadmap.weeklyPlan.length).toBeGreaterThan(0);
    expect(roadmap.monthlyPlan.length).toBeGreaterThan(0);
    expect(roadmap.quarterlyPlan.length).toBeGreaterThan(0);
  });

  it('should manage learning hub items (flashcards, quizzes, notes)', () => {
    const items = getDefaultLearningHubItems();
    const flashcardItem = items.find((i) => i.type === 'flashcard');
    const quizItem = items.find((i) => i.type === 'quiz');

    expect(flashcardItem?.content.flashcards?.length).toBeGreaterThan(0);
    expect(quizItem?.content.quiz?.length).toBeGreaterThan(0);
  });

  it('should provide company-specific preparation packs for 14 companies', () => {
    const packs = getCompanyPrepPacks();
    expect(packs.length).toEqual(14);
    const googlePack = packs.find((p) => p.companyName === 'Google');
    expect(googlePack).toBeDefined();
    expect(googlePack?.interviewPattern.length).toBeGreaterThan(0);
    expect(googlePack?.frequentlyAskedTopics.length).toBeGreaterThan(0);
  });

  it('should generate evidence-backed RAG mentor responses citing user data', async () => {
    const res = await generateRagMentorResponse(
      'demo-user-1',
      'How do I optimize my resume for Google?'
    );
    expect(res.content).toContain('Google');
    expect(res.citedSources).toBeDefined();
    expect(res.citedSources!.length).toBeGreaterThan(0);
    expect(res.recommendedAction).toBeDefined();
  });

  it('should support gamification data and streak tracking', () => {
    const streak = getDefaultDailyCoachStreak();
    expect(streak.currentStreak).toBeGreaterThan(0);
    expect(streak.dailyTasks.length).toEqual(5);

    const gamification = getDefaultGamificationData();
    expect(gamification.currentXp).toBeGreaterThan(0);
    expect(gamification.unlockedBadges.length).toBeGreaterThan(0);
  });

  it('should provide notification items for daily learning', () => {
    const notifs = getDefaultNotifications();
    expect(notifs.length).toBeGreaterThan(0);
    expect(notifs[0].type).toBe('daily_learning');
  });
});
