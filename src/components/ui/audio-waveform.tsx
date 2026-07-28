'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AudioWaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  volumeLevel?: number; // 0.0 to 1.0
  isSpeaking?: boolean;
  barCount?: number;
}

export function AudioWaveform({
  volumeLevel = 0,
  isSpeaking = false,
  barCount = 32,
  className,
  ...props
}: AudioWaveformProps) {
  // Generate bar height scale based on volume level and index
  const bars = React.useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      if (!isSpeaking) return 0.15;
      // Synthesize pseudo-random audio frequency variation
      const baseWave = Math.sin((i / barCount) * Math.PI) * volumeLevel;
      const noise = (Math.sin(i * 1.5) + 1) * 0.2;
      return Math.min(1, Math.max(0.15, baseWave + noise * volumeLevel));
    });
  }, [barCount, isSpeaking, volumeLevel]);

  return (
    <div
      className={cn('flex h-8 items-center justify-center gap-[2px] px-2', className)}
      role="img"
      aria-label={isSpeaking ? 'Audio stream active' : 'Audio stream idle'}
      {...props}
    >
      {bars.map((heightFactor, index) => (
        <span
          key={index}
          className="w-[3px] rounded-full transition-all duration-75 ease-out"
          style={{
            height: `${Math.round(heightFactor * 100)}%`,
            backgroundColor: isSpeaking
              ? `hsl(${212 - index * 2.2}, 100%, ${55 + heightFactor * 15}%)`
              : 'var(--text-tertiary)',
            opacity: isSpeaking ? 0.9 : 0.4,
          }}
        />
      ))}
    </div>
  );
}
