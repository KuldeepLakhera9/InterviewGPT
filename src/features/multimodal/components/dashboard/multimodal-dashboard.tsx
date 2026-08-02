'use client';

import * as React from 'react';
import { Video, Code2, PenTool, Wifi, MessageSquare } from 'lucide-react';
import type { InterviewMode, LiveCoachingToastData } from '../../types/multimodal.types';
import { useLiveVoice } from '../../hooks/use-live-voice';
import { useSpeechSynthesis } from '../../hooks/use-speech-synthesis';
import { usePresenceAnalysis } from '../../hooks/use-presence-analysis';
import { useSpeechAnalytics } from '../../hooks/use-speech-analytics';
import { useCodeRunner } from '../../hooks/use-code-runner';
import { useWhiteboard } from '../../hooks/use-whiteboard';
import { useSessionRecorder } from '../../hooks/use-session-recorder';

import { VoiceControls } from '../voice/voice-controls';
import { AiVoiceAvatar } from '../voice/ai-voice-avatar';
import { WebcamFeed } from '../video/webcam-feed';
import { PresenceMetricsOverlay } from '../presence/presence-metrics-overlay';
import { SpeechAnalyticsPanel } from '../speech/speech-analytics-panel';
import { LiveCoachingToast } from '../speech/live-coaching-toast';
import { CodingWorkspace } from '../coding/coding-workspace';
import { WhiteboardCanvas } from '../whiteboard/whiteboard-canvas';
import { SessionRecorderPanel } from '../recording/session-recorder-panel';
import { RecordingConsentModal } from '../recording/recording-consent-modal';
import {
  getAIInterviewVoiceTurnAction,
  saveMultimodalSessionAction,
} from '../../actions/multimodal.actions';
import { cn } from '@/lib/utils';

interface MultimodalDashboardProps {
  sessionId: string;
  roleTitle?: string;
  companyName?: string;
  initialMode?: InterviewMode;
}

export function MultimodalDashboard({
  sessionId,
  roleTitle = 'Senior Full Stack Engineer',
  companyName = 'Google',
  initialMode = 'practice',
}: MultimodalDashboardProps) {
  const [interviewMode, setInterviewMode] = React.useState<InterviewMode>(initialMode);
  const [activeTab, setActiveTab] = React.useState<'video' | 'coding' | 'whiteboard'>('video');
  const [isConsentModalOpen, setIsConsentModalOpen] = React.useState(false);
  const [liveTranscript, setLiveTranscript] = React.useState<string>(
    'Welcome to your live video interview for the Senior Full Stack Engineer role. Feel free to speak aloud or use the coding workspace when prompted.'
  );
  const [coachingToasts, setCoachingToasts] = React.useState<LiveCoachingToastData[]>([]);

  // 1. Voice Hook
  const voice = useLiveVoice({
    onTranscriptUpdate: (text, isFinal) => {
      if (text) setLiveTranscript(text);
      if (isFinal) {
        speechAnalytics.recordTurnSpeech(text, 15);
        // Trigger AI Voice Response turn
        getAIInterviewVoiceTurnAction(roleTitle, text, interviewMode).then((res) => {
          if (res.success && res.spokenResponseText) {
            speechSynthesis.speak(res.spokenResponseText);
          }
        });
      }
    },
    onSpeechStart: () => {
      // Interrupt AI speech synthesis if speaking
      if (speechSynthesis.isSpeaking) {
        speechSynthesis.interrupt();
      }
    },
  });

  // 2. Speech Synthesis Hook
  const speechSynthesis = useSpeechSynthesis();

  // 3. Presence Hook
  const presence = usePresenceAnalysis();

  // 4. Speech Analytics Hook
  const speechAnalytics = useSpeechAnalytics();

  // 5. Code Runner Hook
  const codeRunner = useCodeRunner('typescript');

  // 6. Whiteboard Hook
  const whiteboard = useWhiteboard();

  // 7. Session Recorder Hook
  const recorder = useSessionRecorder();

  // Handle Save Multimodal Session Data
  const _handleSaveSession = React.useCallback(() => {
    saveMultimodalSessionAction(sessionId, interviewMode, {
      speechAnalytics: speechAnalytics.speechMetrics,
      presenceMetrics: presence.presenceMetrics,
      codingWorkspace: codeRunner.workspace,
      whiteboardData: whiteboard.whiteboardData,
      recordingMetadata: recorder.recordingMetadata,
    });
  }, [
    sessionId,
    interviewMode,
    speechAnalytics.speechMetrics,
    presence.presenceMetrics,
    codeRunner.workspace,
    whiteboard.whiteboardData,
    recorder.recordingMetadata,
  ]);

  return (
    <div id="multimodal-dashboard-container" className="space-y-6">
      {/* Privacy Consent Modal */}
      <RecordingConsentModal
        isOpen={isConsentModalOpen}
        onGrantConsent={() => {
          recorder.grantConsent();
          setIsConsentModalOpen(false);
          recorder.startRecording();
        }}
        onDeclineConsent={() => setIsConsentModalOpen(false)}
      />

      {/* Workspace Header */}
      <div className="flex flex-col items-start justify-between space-y-3 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
              Module 6 Multimodal Active
            </span>
            <h1 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
              Live Multimodal Interview Room
            </h1>
          </div>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            {roleTitle} at {companyName} • Integrated Voice, Video Presence, Code Editor &
            Whiteboard
          </p>
        </div>

        {/* Workspace Health & Tabs Selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
            <Wifi className="h-3.5 w-3.5" />
            <span>Optimal Low-Latency Stream</span>
          </div>
        </div>
      </div>

      {/* Session Recorder Status Toolbar */}
      <SessionRecorderPanel
        recordingMetadata={recorder.recordingMetadata}
        onRequestConsent={() => setIsConsentModalOpen(true)}
        onStartRecording={() => {
          if (!recorder.recordingMetadata.hasUserConsent) {
            setIsConsentModalOpen(true);
          } else {
            recorder.startRecording();
          }
        }}
        onStopRecording={recorder.stopRecording}
        onDeleteRecording={recorder.deleteRecording}
      />

      {/* Main Mode Navigation Tabs (Video Call | Coding Editor | Whiteboard) */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
        <div className="flex items-center space-x-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={cn(
              'flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 transition-all',
              activeTab === 'video'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            )}
          >
            <Video className="h-4 w-4" />
            <span>Live Video & Voice Call</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coding')}
            className={cn(
              'flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 transition-all',
              activeTab === 'coding'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            )}
          >
            <Code2 className="h-4 w-4" />
            <span>Coding Workspace</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('whiteboard')}
            className={cn(
              'flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 transition-all',
              activeTab === 'whiteboard'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            )}
          >
            <PenTool className="h-4 w-4" />
            <span>System Design Whiteboard</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Live Video & Voice Call Room */}
      {activeTab === 'video' && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: AI Voice Avatar + Webcam Feed + Voice Controls */}
          <div className="space-y-4 lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* AI Voice Avatar */}
              <AiVoiceAvatar
                isSpeaking={speechSynthesis.isSpeaking}
                isPaused={speechSynthesis.isPaused}
                interviewerName={`${companyName} AI Lead`}
                onPause={speechSynthesis.pause}
                onResume={speechSynthesis.resume}
                onInterrupt={speechSynthesis.interrupt}
              />

              {/* Candidate Webcam Feed */}
              <WebcamFeed
                isCameraOn={presence.isCameraOn}
                videoRef={presence.videoRef}
                canvasRef={presence.canvasRef}
                permissionError={presence.permissionError}
                onStartCamera={presence.startCamera}
                onStopCamera={presence.stopCamera}
              />
            </div>

            {/* Microphone Voice Controls */}
            <VoiceControls
              isListening={voice.isListening}
              isPushToTalk={voice.isPushToTalk}
              audioLevel={voice.audioLevel}
              speechSpeed={speechSynthesis.speechSpeed}
              availableVoices={speechSynthesis.availableVoices}
              selectedVoice={speechSynthesis.selectedVoice}
              onToggleListening={() => {
                if (voice.isListening) voice.stopListening();
                else voice.startListening();
              }}
              onTogglePushToTalk={() => voice.setIsPushToTalk(!voice.isPushToTalk)}
              onChangeSpeed={speechSynthesis.setSpeechSpeed}
              onSelectVoice={speechSynthesis.setSelectedVoice}
            />

            {/* Live Streaming Transcript */}
            <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                <span>Live Streaming Transcript</span>
              </div>
              <div className="min-h-[60px] rounded-lg bg-[var(--bg-surface-2)] p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                {liveTranscript}
              </div>
            </div>
          </div>

          {/* Right Column: Presence Metrics + Speech Analytics + Live Coaching */}
          <div className="space-y-4 lg:col-span-5">
            {/* Live Coaching Toasts */}
            <LiveCoachingToast
              interviewMode={interviewMode}
              onToggleInterviewMode={setInterviewMode}
              activeToasts={coachingToasts}
              onDismissToast={(id) => setCoachingToasts((t) => t.filter((item) => item.id !== id))}
            />

            {/* Speech Analytics */}
            <SpeechAnalyticsPanel metrics={speechAnalytics.speechMetrics} />

            {/* Webcam Presence Metrics */}
            <PresenceMetricsOverlay metrics={presence.presenceMetrics} />
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Coding Workspace */}
      {activeTab === 'coding' && (
        <CodingWorkspace
          workspace={codeRunner.workspace}
          onChangeCode={codeRunner.setCode}
          onChangeLanguage={codeRunner.setLanguage}
          onRunCode={codeRunner.runCode}
          onClearConsole={codeRunner.clearConsole}
        />
      )}

      {/* Tab 3: System Design Whiteboard */}
      {activeTab === 'whiteboard' && (
        <WhiteboardCanvas
          whiteboardData={whiteboard.whiteboardData}
          activeTool={whiteboard.activeTool}
          currentColor={whiteboard.currentColor}
          currentStrokeWidth={whiteboard.currentStrokeWidth}
          onSelectTool={whiteboard.setActiveTool}
          onChangeColor={whiteboard.setCurrentColor}
          onAddElement={whiteboard.addElement}
          onClearCanvas={whiteboard.clearCanvas}
          onZoomIn={whiteboard.zoomIn}
          onZoomOut={whiteboard.zoomOut}
        />
      )}
    </div>
  );
}
