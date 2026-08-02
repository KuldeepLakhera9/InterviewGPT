'use client';

import * as React from 'react';
import { ShieldCheck, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecordingConsentModalProps {
  isOpen: boolean;
  onGrantConsent: () => void;
  onDeclineConsent: () => void;
}

export function RecordingConsentModal({
  isOpen,
  onGrantConsent,
  onDeclineConsent,
}: RecordingConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="recording-consent-modal"
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-purple-500/30 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Session Recording Consent</h3>
            <p className="text-xs text-slate-400">Privacy & Media Permissions Notice</p>
          </div>
        </div>

        {/* Notice Details */}
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            InterviewGPT requires your explicit consent prior to recording audio or video during
            this mock interview session.
          </p>

          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3.5">
            <div className="flex items-center space-x-2 font-semibold text-purple-300">
              <Video className="h-4 w-4" />
              <span>Webcam Video & Audio Capture</span>
            </div>
            <ul className="list-inside list-disc space-y-1 text-[11px] text-slate-400">
              <li>Recordings are saved locally on your device for session playback review.</li>
              <li>You can stream, download, or delete your recording files at any time.</li>
              <li>Recordings are never sold or shared with unverified third parties.</li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-2 border-t border-slate-800 pt-2">
          <Button
            type="button"
            onClick={onDeclineConsent}
            variant="outline"
            size="sm"
            className="text-xs text-slate-400 hover:text-white"
          >
            Proceed Without Recording
          </Button>
          <Button
            type="button"
            onClick={onGrantConsent}
            size="sm"
            className="space-x-1.5 bg-purple-600 font-bold text-white hover:bg-purple-700"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Grant Consent & Record</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
