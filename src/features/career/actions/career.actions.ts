'use server';

import { createCareerGoal, getCareerGoals } from '../services/career-goal.service';
import { getCandidateSkillGraph } from '../services/skill-graph.service';
import { getPersonalizedRoadmaps } from '../services/learning-roadmap.service';
import { getLearningHubItems } from '../services/learning-hub.service';
import { getRecommendedPortfolioProjects } from '../services/project-recommendation.service';
import { getDailyCoachStreak } from '../services/daily-coach.service';
import { getCompanyPrepPacks } from '../services/company-prep.service';
import { generateRagMentorResponse } from '../services/mentor-chat.service';
import { getGamificationData } from '../services/gamification.service';
import { getAppNotifications } from '../services/notification.service';
import type { CareerGoalData, RagMentorMessage } from '../types/career.types';

const DEMO_USER_ID = 'demo-user-1';

export async function createCareerGoalAction(
  input: Omit<CareerGoalData, 'id' | 'createdAt' | 'isPrimary'>
): Promise<{ success: boolean; data?: CareerGoalData; error?: string }> {
  try {
    const created = await createCareerGoal(DEMO_USER_ID, input);
    return { success: true, data: created };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create career goal';
    return { success: false, error: errorMsg };
  }
}

export async function getCareerGoalsAction(): Promise<{
  success: boolean;
  data?: CareerGoalData[];
  error?: string;
}> {
  try {
    const goals = await getCareerGoals(DEMO_USER_ID);
    return { success: true, data: goals };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to load career goals';
    return { success: false, error: errorMsg };
  }
}

export async function getCareerDashboardDataAction() {
  try {
    const [goals, skillGraph, roadmaps, learningItems, streakData, gamification, notifications] =
      await Promise.all([
        getCareerGoals(DEMO_USER_ID),
        getCandidateSkillGraph(DEMO_USER_ID),
        getPersonalizedRoadmaps(DEMO_USER_ID),
        getLearningHubItems(DEMO_USER_ID),
        getDailyCoachStreak(DEMO_USER_ID),
        getGamificationData(DEMO_USER_ID),
        getAppNotifications(DEMO_USER_ID),
      ]);

    const primaryGoal = goals.find((g) => g.isPrimary) || goals[0];
    const projects = getRecommendedPortfolioProjects(primaryGoal?.targetRole);
    const companyPacks = getCompanyPrepPacks();

    return {
      success: true,
      data: {
        goals,
        skillGraph,
        roadmaps,
        learningItems,
        streakData,
        gamification,
        notifications,
        projects,
        companyPacks,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to load career dashboard';
    return { success: false, error: errorMsg };
  }
}

export async function sendRagMentorMessageAction(
  userMessage: string
): Promise<{ success: boolean; data?: RagMentorMessage; error?: string }> {
  try {
    const reply = await generateRagMentorResponse(DEMO_USER_ID, userMessage);
    return { success: true, data: reply };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate RAG mentor answer';
    return { success: false, error: errorMsg };
  }
}
