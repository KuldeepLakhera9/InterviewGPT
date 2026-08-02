import { describe, it, expect } from 'vitest';
import {
  loadMultimodalPrompt,
  renderMultimodalSystemPrompt,
} from '../ai/services/multimodal-prompt.loader';
import {
  interviewModeSchema,
  speechMetricsSchema,
  presenceMetricsSchema,
  codingWorkspaceSchema,
  whiteboardDataSchema,
  recordingMetadataSchema,
} from '../validators/multimodal.validators';
import { getAIInterviewVoiceTurnAction } from '../actions/multimodal.actions';

describe('Multimodal AI Prompt Loader Suite', () => {
  it('should load version-controlled voice interviewer prompt markdown metadata', () => {
    const meta = loadMultimodalPrompt('voice-interviewer');
    expect(meta.objective).toContain('conversational');
    expect(meta.constraints.length).toBeGreaterThan(0);
    expect(meta.inputSchema).toContain('roleTitle');
    expect(meta.outputSchema).toContain('spokenResponseText');
  });

  it('should load version-controlled live coaching prompt markdown metadata', () => {
    const meta = loadMultimodalPrompt('live-coaching');
    expect(meta.objective).toContain('coaching');
    expect(meta.constraints).toContain(
      'In `assessment` mode, `shouldDisplayToast` MUST ALWAYS evaluate to `false`.'
    );
  });

  it('should render system prompt for multimodal pipeline', () => {
    const rendered = renderMultimodalSystemPrompt('voice-interviewer');
    expect(rendered).toContain('OBJECTIVE:');
    expect(rendered).toContain('EXPECTED OUTPUT FORMAT');
  });
});

describe('Multimodal Zod Schema Validation Suite', () => {
  it('should validate 8 interview modes correctly', () => {
    const validModes = [
      'practice',
      'assessment',
      'mock_company',
      'behavioral',
      'technical',
      'coding',
      'system_design',
      'custom',
    ];
    validModes.forEach((mode) => {
      expect(interviewModeSchema.parse(mode)).toBe(mode);
    });
  });

  it('should validate speech metrics payload', () => {
    const validSpeechMetrics = {
      speakingPaceWpm: 140,
      totalWords: 250,
      averageResponseDurationSeconds: 45,
      pauseCount: 4,
      longPauseCount: 1,
      fillerCount: 3,
      fillerDensityPercentage: 1.2,
      fillerWordsFound: [{ word: 'um', count: 3 }],
      speechConsistencyScore: 92,
      transcriptCompletenessScore: 98,
    };
    const parsed = speechMetricsSchema.parse(validSpeechMetrics);
    expect(parsed.speakingPaceWpm).toBe(140);
  });

  it('should validate presence metrics payload', () => {
    const validPresence = {
      isCameraOn: true,
      isFaceVisible: true,
      faceCentredScore: 90,
      postureQuality: 'good' as const,
      lightingScore: 88,
      isEyeContactEstimated: true,
      outOfFrameCount: 0,
      overallPresenceScore: 89,
      disclaimer: 'Presence analytics strictly evaluate webcam framing.',
    };
    const parsed = presenceMetricsSchema.parse(validPresence);
    expect(parsed.faceCentredScore).toBe(90);
  });

  it('should validate coding workspace payload', () => {
    const validCoding = {
      code: 'function test() {}',
      language: 'typescript' as const,
      testCases: [
        {
          id: '1',
          title: 'Case 1',
          input: '1',
          expectedOutput: '1',
          passed: true,
        },
      ],
      consoleOutput: ['Log 1'],
      executionStatus: 'success' as const,
    };
    const parsed = codingWorkspaceSchema.parse(validCoding);
    expect(parsed.language).toBe('typescript');
  });

  it('should validate whiteboard data payload', () => {
    const validWhiteboard = {
      elements: [
        {
          id: 'el-1',
          type: 'rectangle' as const,
          x: 10,
          y: 20,
          width: 100,
          height: 50,
          color: '#ffffff',
          strokeWidth: 2,
        },
      ],
      zoom: 1,
      panX: 0,
      panY: 0,
      backgroundColor: '#000000',
    };
    const parsed = whiteboardDataSchema.parse(validWhiteboard);
    expect(parsed.elements[0].type).toBe('rectangle');
  });

  it('should validate session recording metadata', () => {
    const validRecording = {
      isRecording: true,
      hasUserConsent: true,
      durationSeconds: 120,
      format: 'video/webm' as const,
    };
    const parsed = recordingMetadataSchema.parse(validRecording);
    expect(parsed.isRecording).toBe(true);
  });
});

describe('Multimodal AI Voice Actions Suite', () => {
  it('should generate a natural AI interviewer response turn', async () => {
    const res = await getAIInterviewVoiceTurnAction(
      'Senior Full Stack Engineer',
      'I optimized the database query.',
      'practice'
    );
    expect(res.success).toBe(true);
    expect(res.spokenResponseText).toBeDefined();
    expect(res.spokenResponseText?.length).toBeGreaterThan(10);
  });
});
