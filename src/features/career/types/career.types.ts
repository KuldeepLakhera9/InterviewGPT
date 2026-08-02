export type SkillCategory =
  | 'programming_languages'
  | 'frameworks'
  | 'databases'
  | 'devops'
  | 'cloud'
  | 'ai_ml'
  | 'soft_skills'
  | 'system_design'
  | 'dsa'
  | 'communication';

export interface CareerGoalData {
  id: string;
  dreamCompany: string;
  targetRole: string;
  experienceLevel: string;
  salaryGoal?: string;
  preferredIndustry?: string;
  preferredLocation?: string;
  targetTimeline: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface SkillItem {
  name: string;
  category: SkillCategory;
  currentLevel: number; // 0 - 100
  targetLevel: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  evidenceSources: string[]; // e.g. "Resume Parse", "Mock Interview #3"
  lastUpdated: string;
}

export interface SkillGraphData {
  id: string;
  overallScore: number;
  skills: SkillItem[];
  lastUpdated: string;
}

export interface MissingSkillItem {
  name: string;
  category: SkillCategory;
  importance: 'critical' | 'high' | 'medium';
  estimatedHoursToMaster: number;
}

export interface WeakSkillItem {
  name: string;
  currentLevel: number;
  targetLevel: number;
  suggestedPractice: string;
}

export interface SkillGapAnalysisData {
  missingSkills: MissingSkillItem[];
  weakSkills: WeakSkillItem[];
  overallReadinessPercentage: number;
}

export interface RoadmapDailyUnit {
  day: number;
  focusTopic: string;
  activity: string;
  estimatedHours: number;
  isCompleted?: boolean;
}

export interface RoadmapWeeklyUnit {
  week: number;
  theme: string;
  goals: string[];
  milestone: string;
}

export interface RoadmapMonthlyUnit {
  month: number;
  focusPillar: string;
  outcomes: string[];
}

export interface RoadmapQuarterlyUnit {
  quarter: number;
  headlineGoal: string;
  keyDeliverables: string[];
}

export interface PersonalizedRoadmapData {
  id: string;
  title: string;
  targetRole: string;
  dailyPlan: RoadmapDailyUnit[];
  weeklyPlan: RoadmapWeeklyUnit[];
  monthlyPlan: RoadmapMonthlyUnit[];
  quarterlyPlan: RoadmapQuarterlyUnit[];
  completionStatus: number; // 0 - 100
  createdAt: string;
}

export type LearningHubType = 'note' | 'resource' | 'flashcard' | 'quiz' | 'practice_set';

export interface FlashcardCard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LearningHubItemData {
  id: string;
  type: LearningHubType;
  title: string;
  category: string;
  content: {
    text?: string;
    url?: string;
    flashcards?: FlashcardCard[];
    quiz?: QuizQuestion[];
  };
  isBookmarked: boolean;
  createdAt: string;
}

export interface ProjectRecommendationData {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  techStack: string[];
  learningOutcomes: string[];
  resumeImpact: string;
}

export type DailyCoachTaskCategory =
  'coding' | 'behavioral' | 'system_design' | 'resume' | 'communication';

export interface DailyCoachTaskData {
  id: string;
  category: DailyCoachTaskCategory;
  title: string;
  estimatedMinutes: number;
  xpReward: number;
  isCompleted: boolean;
}

export interface DailyCoachStreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyTasks: DailyCoachTaskData[];
}

export interface CompanyPrepPackData {
  id: string;
  companyName: string;
  logoInitial: string;
  badgeColor: string;
  overview: string;
  interviewPattern: string[];
  frequentlyAskedTopics: string[];
  skillPriorities: string[];
  practiceQuestions: string[];
  recommendedProjects: string[];
  preparationTimelineWeeks: number;
}

export interface RagMentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citedSources?: string[];
  recommendedAction?: string;
  createdAt: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export interface GamificationData {
  currentXp: number;
  currentLevel: number;
  unlockedBadges: BadgeItem[];
  milestones: Array<{ title: string; targetXp: number; isReached: boolean }>;
}

export interface AppNotificationData {
  id: string;
  type: 'daily_learning' | 'practice' | 'resume' | 'interview' | 'goal';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}
