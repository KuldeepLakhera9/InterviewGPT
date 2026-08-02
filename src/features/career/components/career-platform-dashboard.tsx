'use client';

import * as React from 'react';
import { CareerGoalCard } from './goals/career-goal-card';
import { InteractiveSkillGraph } from './skill-graph/interactive-skill-graph';
import { SkillGapAnalysisCard } from './skill-graph/skill-gap-analysis-card';
import { LearningRoadmapTimeline } from './roadmap/learning-roadmap-timeline';
import { LearningHubView } from './hub/learning-hub-view';
import { ProjectRecommendationCard } from './projects/project-recommendation-card';
import { DailyCoachWidget } from './coach/daily-coach-widget';
import { CompanyPrepGrid } from './company-packs/company-prep-grid';
import { RagMentorChatView } from './mentor-chat/rag-mentor-chat-view';
import { GamificationBadgeBar } from './gamification/gamification-badge-bar';
import { NotificationCenter } from './notifications/notification-center';
import type {
  CareerGoalData,
  SkillGraphData,
  SkillGapAnalysisData,
  PersonalizedRoadmapData,
  LearningHubItemData,
  ProjectRecommendationData,
  DailyCoachStreakData,
  CompanyPrepPackData,
  GamificationData,
  AppNotificationData,
} from '../types/career.types';

interface CareerPlatformDashboardProps {
  goals: CareerGoalData[];
  skillGraph: SkillGraphData[];
  gapAnalysis: SkillGapAnalysisData;
  roadmaps: PersonalizedRoadmapData[];
  learningItems: LearningHubItemData[];
  projects: ProjectRecommendationData[];
  streakData: DailyCoachStreakData;
  companyPacks: CompanyPrepPackData[];
  gamification: GamificationData;
  notifications: AppNotificationData[];
}

export function CareerPlatformDashboard({
  goals,
  skillGraph,
  gapAnalysis,
  roadmaps,
  learningItems,
  projects,
  streakData,
  companyPacks,
  gamification,
  notifications,
}: CareerPlatformDashboardProps) {
  const currentSkillGraph = skillGraph[0];
  const currentRoadmap = roadmaps[0];

  return (
    <div id="career-platform-dashboard-container" className="space-y-6 pb-12">
      {/* Platform Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-white">
            AI Career Coach & Learning Intelligence
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Continuous, evidence-based career guidance, living skill gap analysis, and target
            company roadmaps.
          </p>
        </div>

        <NotificationCenter notifications={notifications} />
      </div>

      {/* Gamification Bar */}
      <GamificationBadgeBar data={gamification} />

      {/* Main Grid Section 1: Target Goals & Daily Coach */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CareerGoalCard goals={goals} />
        </div>
        <DailyCoachWidget streakData={streakData} />
      </div>

      {/* Section 2: Living Skill Graph & Gap Analysis */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InteractiveSkillGraph skillGraph={currentSkillGraph} />
        </div>
        <SkillGapAnalysisCard gapAnalysis={gapAnalysis} />
      </div>

      {/* Section 3: Personalized Learning Roadmap Timeline */}
      <LearningRoadmapTimeline roadmap={currentRoadmap} />

      {/* Section 4: RAG AI Mentor Chat & Learning Hub */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RagMentorChatView />
        <LearningHubView items={learningItems} />
      </div>

      {/* Section 5: Portfolio Projects Recommendation Engine */}
      <ProjectRecommendationCard projects={projects} />

      {/* Section 6: Company-Specific Preparation Packs */}
      <CompanyPrepGrid packs={companyPacks} />
    </div>
  );
}
