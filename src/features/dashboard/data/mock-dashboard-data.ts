export interface CandidateProfile {
  name: string;
  email: string;
  avatarUrl: string;
  targetRole: string;
  targetCompanyTier: string;
  workspaceName: string;
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

export interface PillarScore {
  name: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'needs_improvement';
}

export interface ReadinessTrendPoint {
  day: string;
  score: number;
}

export interface RecentSessionItem {
  id: string;
  track: 'Technical Coding' | 'System Design' | 'STAR Behavioral';
  role: string;
  score: number;
  durationMinutes: number;
  date: string;
}

export interface UpcomingPracticeSession {
  id: string;
  title: string;
  type: string;
  scheduledTime: string;
  duration: string;
}

export interface WeeklyGoal {
  title: string;
  completedSessions: number;
  targetSessions: number;
  daysRemaining: number;
}

export const mockCandidateProfile: CandidateProfile = {
  name: 'Alex Chen',
  email: 'admin@interviewgpt.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  targetRole: 'Senior Full-Stack Engineer',
  targetCompanyTier: 'FAANG / Tier-1 Tech',
  workspaceName: 'InterviewGPT Demo Workspace',
};

export const mockKpis: DashboardKpi[] = [
  {
    id: 'readiness',
    label: 'Readiness Index',
    value: '84.5 / 100',
    change: '+4.2%',
    trend: 'up',
    description: 'Based on last 5 session scorecards',
  },
  {
    id: 'sessions',
    label: 'Completed Sessions',
    value: '12',
    change: '+3 this week',
    trend: 'up',
    description: 'Technical & STAR mock interviews',
  },
  {
    id: 'alignment',
    label: 'Target JD Match',
    value: '91%',
    change: '+6.0%',
    trend: 'up',
    description: 'Match with Senior Staff JD',
  },
  {
    id: 'speech',
    label: 'Avg Filler Words',
    value: '2.8 / min',
    change: '-1.4 / min',
    trend: 'up',
    description: 'Speaking pace 142 WPM',
  },
];

export const mockPillarScores: PillarScore[] = [
  { name: 'Technical Depth & Accuracy', score: 88, maxScore: 100, status: 'excellent' },
  { name: 'Communication Clarity', score: 82, maxScore: 100, status: 'good' },
  { name: 'Problem Solving Methodology', score: 85, maxScore: 100, status: 'excellent' },
  { name: 'Behavioral STAR Framing', score: 83, maxScore: 100, status: 'good' },
];

export const mockReadinessTrend: ReadinessTrendPoint[] = [
  { day: 'Mon', score: 72 },
  { day: 'Tue', score: 76 },
  { day: 'Wed', score: 79 },
  { day: 'Thu', score: 81 },
  { day: 'Fri', score: 82 },
  { day: 'Sat', score: 84 },
  { day: 'Sun', score: 85 },
];

export const mockRecentActivity: RecentSessionItem[] = [
  {
    id: 'sess-1',
    track: 'System Design',
    role: 'Distributed Rate Limiter Architecture',
    score: 88,
    durationMinutes: 45,
    date: 'Today, 2:30 PM',
  },
  {
    id: 'sess-2',
    track: 'Technical Coding',
    role: 'LRU Cache Implementation in Go',
    score: 92,
    durationMinutes: 30,
    date: 'Yesterday',
  },
  {
    id: 'sess-3',
    track: 'STAR Behavioral',
    role: 'Navigating Technical Conflict with Product Lead',
    score: 79,
    durationMinutes: 20,
    date: '3 days ago',
  },
];

export const mockUpcomingPractice: UpcomingPracticeSession[] = [
  {
    id: 'up-1',
    title: 'Distributed Caching & Sharding',
    type: 'System Design Simulation',
    scheduledTime: 'Tomorrow, 10:00 AM',
    duration: '45 mins',
  },
  {
    id: 'up-2',
    title: 'STAR Method: Handling Project Failure',
    type: 'Behavioral Practice',
    scheduledTime: 'Fri, Jul 31, 4:00 PM',
    duration: '20 mins',
  },
];

export const mockGoalData: WeeklyGoal = {
  title: 'Complete 4 Mock Interviews This Week',
  completedSessions: 3,
  targetSessions: 4,
  daysRemaining: 2,
};
