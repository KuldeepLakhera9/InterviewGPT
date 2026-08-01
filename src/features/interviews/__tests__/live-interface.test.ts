import { describe, expect, it } from 'vitest';

describe('Live Interview Interface Suite', () => {
  it('should calculate interview completion percentage accurately', () => {
    const calcProgress = (currentIdx: number, total: number, isCompleted: boolean) => {
      const turnsCompleted = currentIdx + (isCompleted ? 1 : 0);
      return Math.min(Math.round((turnsCompleted / (total || 1)) * 100), 100);
    };

    expect(calcProgress(0, 5, false)).toBe(0);
    expect(calcProgress(2, 5, false)).toBe(40);
    expect(calcProgress(4, 5, true)).toBe(100);
  });

  it('should format target answer duration in minutes', () => {
    const formatDuration = (seconds?: number) => {
      if (!seconds) return 'N/A';
      return `~${Math.round(seconds / 60)}m`;
    };

    expect(formatDuration(180)).toBe('~3m');
    expect(formatDuration(300)).toBe('~5m');
    expect(formatDuration(undefined)).toBe('N/A');
  });
});
