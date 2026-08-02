import { z } from 'zod';

export const interviewModeSchema = z.enum([
  'practice',
  'assessment',
  'mock_company',
  'behavioral',
  'technical',
  'coding',
  'system_design',
  'custom',
]);

export const programmingLanguageSchema = z.enum([
  'typescript',
  'javascript',
  'python',
  'go',
  'java',
  'cpp',
]);

export const speechMetricsSchema = z.object({
  speakingPaceWpm: z.number().min(0),
  totalWords: z.number().min(0),
  averageResponseDurationSeconds: z.number().min(0),
  pauseCount: z.number().min(0),
  longPauseCount: z.number().min(0),
  fillerCount: z.number().min(0),
  fillerDensityPercentage: z.number().min(0).max(100),
  fillerWordsFound: z.array(z.object({ word: z.string(), count: z.number() })),
  speechConsistencyScore: z.number().min(0).max(100),
  transcriptCompletenessScore: z.number().min(0).max(100),
});

export const presenceMetricsSchema = z.object({
  isCameraOn: z.boolean(),
  isFaceVisible: z.boolean(),
  faceCentredScore: z.number().min(0).max(100),
  postureQuality: z.enum(['good', 'slouched', 'off_center', 'unknown']),
  lightingScore: z.number().min(0).max(100),
  isEyeContactEstimated: z.boolean(),
  outOfFrameCount: z.number().min(0),
  overallPresenceScore: z.number().min(0).max(100),
  disclaimer: z.string(),
});

export const testCaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  input: z.string(),
  expectedOutput: z.string(),
  actualOutput: z.string().optional(),
  passed: z.boolean().optional(),
  error: z.string().optional(),
  executionTimeMs: z.number().optional(),
});

export const codingWorkspaceSchema = z.object({
  code: z.string(),
  language: programmingLanguageSchema,
  testCases: z.array(testCaseSchema),
  consoleOutput: z.array(z.string()),
  executionStatus: z.enum(['idle', 'running', 'success', 'failed', 'error']),
  lastRunTimestamp: z.string().optional(),
});

export const whiteboardElementSchema = z.object({
  id: z.string(),
  type: z.enum(['select', 'pen', 'rectangle', 'circle', 'line', 'arrow', 'text', 'eraser']),
  points: z.array(z.number()).optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  radius: z.number().optional(),
  text: z.string().optional(),
  color: z.string(),
  strokeWidth: z.number(),
});

export const whiteboardDataSchema = z.object({
  elements: z.array(whiteboardElementSchema),
  zoom: z.number(),
  panX: z.number(),
  panY: z.number(),
  backgroundColor: z.string(),
});

export const recordingMetadataSchema = z.object({
  isRecording: z.boolean(),
  hasUserConsent: z.boolean(),
  durationSeconds: z.number(),
  recordedAt: z.string().optional(),
  videoBlobUrl: z.string().optional(),
  audioBlobUrl: z.string().optional(),
  fileSizeBytes: z.number().optional(),
  format: z.enum(['video/webm', 'audio/webm', 'audio/wav']).optional(),
});

export const saveMultimodalSessionPayloadSchema = z.object({
  sessionId: z.string().uuid(),
  interviewMode: interviewModeSchema,
  speechAnalytics: speechMetricsSchema.optional(),
  presenceMetrics: presenceMetricsSchema.optional(),
  codingWorkspace: codingWorkspaceSchema.optional(),
  whiteboardData: whiteboardDataSchema.optional(),
  recordingMetadata: recordingMetadataSchema.optional(),
});
