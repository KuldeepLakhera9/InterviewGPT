'use client';

import * as React from 'react';
import { Mic, MicOff, Radio, Volume2, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceControlsProps {
  isListening: boolean;
  isPushToTalk: boolean;
  audioLevel: number;
  speechSpeed: number;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onToggleListening: () => void;
  onTogglePushToTalk: () => void;
  onChangeSpeed: (speed: number) => void;
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
}

export function VoiceControls({
  isListening,
  isPushToTalk,
  audioLevel,
  speechSpeed,
  availableVoices,
  selectedVoice,
  onToggleListening,
  onTogglePushToTalk,
  onChangeSpeed,
  onSelectVoice,
}: VoiceControlsProps) {
  return (
    <div
      id="voice-controls-panel"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm"
    >
      {/* Mic Status & Toggle */}
      <div className="flex items-center space-x-3">
        <Button
          type="button"
          onClick={onToggleListening}
          variant={isListening ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'space-x-2 transition-all',
            isListening
              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
          )}
        >
          {isListening ? <Mic className="h-4 w-4 animate-pulse" /> : <MicOff className="h-4 w-4" />}
          <span className="text-xs font-bold">{isListening ? 'Mic Active' : 'Unmute Mic'}</span>
        </Button>

        {/* Audio Gain Meter */}
        <div className="flex items-center space-x-1.5 rounded-lg bg-[var(--bg-surface-2)] px-3 py-1.5">
          <Volume2 className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-700/40">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-100',
                audioLevel > 50
                  ? 'bg-amber-400'
                  : audioLevel > 20
                    ? 'bg-emerald-400'
                    : 'bg-gray-500'
              )}
              style={{ width: `${Math.min(100, audioLevel)}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-[var(--text-tertiary)]">{audioLevel}%</span>
        </div>
      </div>

      {/* Mode & Voice Configuration */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Push to Talk Toggle */}
        <Button
          type="button"
          onClick={onTogglePushToTalk}
          variant="outline"
          size="sm"
          className={cn(
            'text-[11px] font-semibold',
            isPushToTalk
              ? 'border-purple-500/40 bg-purple-500/20 text-purple-300'
              : 'text-[var(--text-secondary)]'
          )}
        >
          <Radio className="mr-1.5 h-3.5 w-3.5" />
          {isPushToTalk ? 'Push-to-Talk (Hold)' : 'Continuous Hands-Free'}
        </Button>

        {/* Speech Speed Selector */}
        <div className="flex items-center space-x-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-2 py-1">
          <Sliders className="h-3 w-3 text-purple-400" />
          <span className="text-[10px] text-[var(--text-tertiary)]">Speed:</span>
          {[0.9, 1.0, 1.1].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChangeSpeed(s)}
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] font-bold transition-all',
                speechSpeed === s
                  ? 'bg-purple-600 text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              )}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Voice Selection Dropdown */}
        {availableVoices.length > 0 && (
          <select
            value={selectedVoice?.name || ''}
            onChange={(e) => {
              const voice = availableVoices.find((v) => v.name === e.target.value);
              if (voice) onSelectVoice(voice);
            }}
            className="max-w-[140px] truncate rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-2 py-1 text-[11px] text-[var(--text-primary)] focus:ring-1 focus:ring-purple-500 focus:outline-none"
          >
            {availableVoices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name.replace(/Google|Microsoft|Apple/gi, '').trim()} ({v.lang})
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
