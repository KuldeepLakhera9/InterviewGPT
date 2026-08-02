'use client';

import * as React from 'react';
import type { SessionRecordingMetadata } from '../types/multimodal.types';

export function useSessionRecorder() {
  const [recordingMetadata, setRecordingMetadata] = React.useState<SessionRecordingMetadata>({
    isRecording: false,
    hasUserConsent: false,
    durationSeconds: 0,
  });

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const recordedChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const grantConsent = React.useCallback(() => {
    setRecordingMetadata((prev) => ({ ...prev, hasUserConsent: true }));
  }, []);

  const stopRecording = React.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }
  }, []);

  const revokeConsent = React.useCallback(() => {
    if (recordingMetadata.isRecording) {
      stopRecording();
    }
    setRecordingMetadata((prev) => ({ ...prev, hasUserConsent: false }));
  }, [recordingMetadata.isRecording, stopRecording]);

  const startRecording = React.useCallback(
    async (stream?: MediaStream) => {
      if (!recordingMetadata.hasUserConsent) {
        throw new Error('User consent required before starting recording.');
      }

      try {
        let mediaStream = stream;
        if (!mediaStream) {
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        }

        recordedChunksRef.current = [];
        const recorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const videoBlobUrl = URL.createObjectURL(blob);

          setRecordingMetadata((prev) => ({
            ...prev,
            isRecording: false,
            videoBlobUrl,
            fileSizeBytes: blob.size,
            recordedAt: new Date().toISOString(),
            format: 'video/webm',
          }));
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;

        setRecordingMetadata((prev) => ({
          ...prev,
          isRecording: true,
          durationSeconds: 0,
        }));

        timerRef.current = setInterval(() => {
          setRecordingMetadata((prev) => ({
            ...prev,
            durationSeconds: prev.durationSeconds + 1,
          }));
        }, 1000);
      } catch (err: unknown) {
        console.warn('Failed to start recording:', err);
        setRecordingMetadata((prev) => ({ ...prev, isRecording: false }));
      }
    },
    [recordingMetadata.hasUserConsent]
  );

  const deleteRecording = React.useCallback(() => {
    if (recordingMetadata.videoBlobUrl) {
      URL.revokeObjectURL(recordingMetadata.videoBlobUrl);
    }
    setRecordingMetadata((prev) => ({
      ...prev,
      isRecording: false,
      durationSeconds: 0,
      videoBlobUrl: undefined,
      audioBlobUrl: undefined,
      fileSizeBytes: undefined,
      recordedAt: undefined,
    }));
  }, [recordingMetadata.videoBlobUrl]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordingMetadata.videoBlobUrl) {
        URL.revokeObjectURL(recordingMetadata.videoBlobUrl);
      }
    };
  }, [recordingMetadata.videoBlobUrl]);

  return {
    recordingMetadata,
    grantConsent,
    revokeConsent,
    startRecording,
    stopRecording,
    deleteRecording,
  };
}
