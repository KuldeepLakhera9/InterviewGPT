import * as React from 'react';
import { getCareerGoals } from '@/features/career/services/career-goal.service';
import { getCandidateSkillGraph } from '@/features/career/services/skill-graph.service';
import { computeSkillGapAnalysis } from '@/features/career/services/skill-gap.service';
import { getPersonalizedRoadmaps } from '@/features/career/services/learning-roadmap.service';
import { getLearningHubItems } from '@/features/career/services/learning-hub.service';
import { getRecommendedPortfolioProjects } from '@/features/career/services/project-recommendation.service';
import { getDailyCoachStreak } from '@/features/career/services/daily-coach.service';
import { getCompanyPrepPacks } from '@/features/career/services/company-prep.service';
import { getGamificationData } from '@/features/career/services/gamification.service';
import { getAppNotifications } from '@/features/career/services/notification.service';
import { CareerPlatformDashboard } from '@/features/career/components/career-platform-dashboard';

export default async function CareerHubPage() {
  const userId = 'demo-user-1';

  const [goals, skillGraphData, roadmaps, learningItems, streakData, gamification, notifications] =
    await Promise.all([
      getCareerGoals(userId),
      getCandidateSkillGraph(userId),
      getPersonalizedRoadmaps(userId),
      getLearningHubItems(userId),
      getDailyCoachStreak(userId),
      getGamificationData(userId),
      getAppNotifications(userId),
    ]);

  const primaryGoal = goals.find((g) => g.isPrimary) || goals[0];
  const gapAnalysis = computeSkillGapAnalysis(skillGraphData, primaryGoal?.targetRole);
  const projects = getRecommendedPortfolioProjects(primaryGoal?.targetRole);
  const companyPacks = getCompanyPrepPacks();

  return (
    <div className="container mx-auto px-4 py-6">
      <CareerPlatformDashboard
        goals={goals}
        skillGraph={[skillGraphData]}
        gapAnalysis={gapAnalysis}
        roadmaps={roadmaps}
        learningItems={learningItems}
        projects={projects}
        streakData={streakData}
        companyPacks={companyPacks}
        gamification={gamification}
        notifications={notifications}
      />
    </div>
  );
}
