'use client';

import * as React from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebcamFeedProps {
  isCameraOn: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  permissionError: string | null;
  onStartCamera: () => void;
  onStopCamera: () => void;
}

export function WebcamFeed({
  isCameraOn,
  videoRef,
  canvasRef,
  permissionError,
  onStartCamera,
  onStopCamera,
}: WebcamFeedProps) {
  return (
    <div
      id="webcam-feed-container"
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-black shadow-lg"
    >
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Feed */}
      <div className="relative flex aspect-video w-full max-w-lg items-center justify-center overflow-hidden bg-slate-950">
        {isCameraOn ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="h-full w-full -scale-x-100 transform object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center text-gray-400">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-800 bg-gray-900">
              <CameraOff className="h-8 w-8 text-gray-500" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-300">Webcam Camera Offline</p>
              <p className="text-[11px] text-gray-500">
                Enable camera for webcam presence and eye-contact feedback.
              </p>
            </div>
            <Button
              type="button"
              onClick={onStartCamera}
              size="sm"
              className="space-x-2 bg-purple-600 text-white hover:bg-purple-700"
            >
              <Camera className="h-4 w-4" />
              <span>Enable Camera Feed</span>
            </Button>
            {permissionError && (
              <p className="max-w-xs text-[10px] text-rose-400">{permissionError}</p>
            )}
          </div>
        )}

        {/* Live Camera Active Badge & Controls */}
        {isCameraOn && (
          <div className="pointer-events-auto absolute top-3 right-3 left-3 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] text-white backdrop-blur-md">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              <span className="font-bold">LIVE CAM</span>
            </div>

            <Button
              type="button"
              onClick={onStopCamera}
              variant="outline"
              size="sm"
              className="h-6 space-x-1 border-white/20 bg-black/60 text-[10px] text-gray-300 hover:bg-rose-600 hover:text-white"
            >
              <CameraOff className="h-3 w-3" />
              <span>Turn Off</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
