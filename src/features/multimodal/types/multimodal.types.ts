export type InterviewMode =
  | 'practice'
  | 'assessment'
  | 'mock_company'
  | 'behavioral'
  | 'technical'
  | 'coding'
  | 'system_design'
  | 'custom';

export type ProgrammingLanguage = 'typescript' | 'javascript' | 'python' | 'go' | 'java' | 'cpp';

export interface SpeechMetricsData {
  speakingPaceWpm: number;
  totalWords: number;
  averageResponseDurationSeconds: number;
  pauseCount: number;
  longPauseCount: number; // Pauses > 3 seconds
  fillerCount: number;
  fillerDensityPercentage: number;
  fillerWordsFound: Array<{ word: string; count: number }>;
  speechConsistencyScore: number;
  transcriptCompletenessScore: number;
}

export interface PresenceMetricsData {
  isCameraOn: boolean;
  isFaceVisible: boolean;
  faceCentredScore: number; // 0-100
  postureQuality: 'good' | 'slouched' | 'off_center' | 'unknown';
  lightingScore: number; // 0-100
  isEyeContactEstimated: boolean;
  outOfFrameCount: number;
  overallPresenceScore: number; // 0-100
  disclaimer: string;
}

export interface LiveCoachingToastData {
  id: string;
  category: 'pace' | 'volume' | 'presence' | 'filler_words' | 'response_length';
  message: string;
  severity: 'info' | 'warning' | 'tip';
  timestamp: string;
}

export interface TestCase {
  id: string;
  title: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  error?: string;
  executionTimeMs?: number;
}

export interface CodingWorkspaceData {
  code: string;
  language: ProgrammingLanguage;
  testCases: TestCase[];
  consoleOutput: string[];
  executionStatus: 'idle' | 'running' | 'success' | 'failed' | 'error';
  lastRunTimestamp?: string;
}

export type WhiteboardTool =
  'select' | 'pen' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text' | 'eraser';

export interface WhiteboardElement {
  id: string;
  type: WhiteboardTool;
  points?: number[]; // [x1, y1, x2, y2, ...] for pen / lines
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  color: string;
  strokeWidth: number;
}

export interface WhiteboardData {
  elements: WhiteboardElement[];
  zoom: number;
  panX: number;
  panY: number;
  backgroundColor: string;
}

export interface SessionRecordingMetadata {
  isRecording: boolean;
  hasUserConsent: boolean;
  durationSeconds: number;
  recordedAt?: string;
  videoBlobUrl?: string;
  audioBlobUrl?: string;
  fileSizeBytes?: number;
  format?: 'video/webm' | 'audio/webm' | 'audio/wav';
}

export interface MultimodalSessionFullState {
  sessionId: string;
  interviewMode: InterviewMode;
  isVoiceActive: boolean;
  isPushToTalk: boolean;
  selectedVoiceId: string;
  speechSpeed: number;
  speechAnalytics: SpeechMetricsData;
  presenceMetrics: PresenceMetricsData;
  activeCoachingToasts: LiveCoachingToastData[];
  codingWorkspace: CodingWorkspaceData;
  whiteboardData: WhiteboardData;
  recordingMetadata: SessionRecordingMetadata;
  sessionHealth: 'optimal' | 'degraded' | 'reconnecting';
  updatedAt: string;
}
