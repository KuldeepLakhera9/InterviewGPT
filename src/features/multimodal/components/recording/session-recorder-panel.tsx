'use client';

import * as React from 'react';
import { Video, Square, Download, Trash2, Shield } from 'lucide-react';
import type { SessionRecordingMetadata } from '../../types/multimodal.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SessionRecorderPanelProps {
  recordingMetadata: SessionRecordingMetadata;
  onRequestConsent: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onDeleteRecording: () => void;
}

export function SessionRecorderPanel({
  recordingMetadata,
  onRequestConsent,
  onStartRecording,
  onStopRecording,
  onDeleteRecording,
}: SessionRecorderPanelProps) {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="session-recorder-panel"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm"
    >
      <div className="flex items-center space-x-3">
        {/* REC Status Badge */}
        <div
          className={cn(
            'flex items-center space-x-2 rounded-full border px-3 py-1 text-xs font-bold transition-all',
            recordingMetadata.isRecording
              ? 'animate-pulse border-rose-500/40 bg-rose-500/20 text-rose-300'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)]'
          )}
        >
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              recordingMetadata.isRecording ? 'animate-ping bg-rose-500' : 'bg-gray-500'
            )}
          />
          <span>
            {recordingMetadata.isRecording
              ? `REC (${formatTime(recordingMetadata.durationSeconds)})`
              : 'Recording Standby'}
          </span>
        </div>

        {/* Consent Badge */}
        <span className="flex items-center space-x-1 text-[11px] text-[var(--text-tertiary)]">
          <Shield className="h-3 w-3 text-purple-400" />
          <span>{recordingMetadata.hasUserConsent ? 'Consent Granted' : 'Consent Pending'}</span>
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-2 text-xs">
        {!recordingMetadata.hasUserConsent ? (
          <Button
            type="button"
            onClick={onRequestConsent}
            variant="outline"
            size="sm"
            className="space-x-1 border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Enable Consent</span>
          </Button>
        ) : recordingMetadata.isRecording ? (
          <Button
            type="button"
            onClick={onStopRecording}
            variant="outline"
            size="sm"
            className="space-x-1 border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-600 hover:text-white"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            <span>Stop Recording</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onStartRecording}
            size="sm"
            className="space-x-1 bg-purple-600 font-bold text-white shadow-sm hover:bg-purple-700"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Start Recording</span>
          </Button>
        )}

        {/* Playback & Download if video recorded */}
        {recordingMetadata.videoBlobUrl && (
          <div className="flex items-center space-x-1.5 border-l border-[var(--border-subtle)] pl-2">
            <a
              href={recordingMetadata.videoBlobUrl}
              download="InterviewGPT_Session_Recording.webm"
              className="inline-flex items-center space-x-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-300 hover:bg-purple-500/20"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>

            <Button
              type="button"
              onClick={onDeleteRecording}
              variant="outline"
              size="sm"
              className="h-7 text-rose-400 hover:bg-rose-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
