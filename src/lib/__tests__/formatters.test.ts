import { describe, expect, it } from 'vitest';
import { formatDate, formatDuration, formatScore, truncateText } from '../formatters';

describe('Formatters Utility Suite', () => {
  it('formats seconds into MM:SS correctly', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(45)).toBe('00:45');
    expect(formatDuration(125)).toBe('02:05');
  });

  it('formats numeric scores correctly', () => {
    expect(formatScore(84.5)).toBe('84.5 / 100');
    expect(formatScore(90)).toBe('90.0 / 100');
  });

  it('truncates text properly', () => {
    expect(truncateText('Hello World', 20)).toBe('Hello World');
    expect(truncateText('InterviewGPT is an AI-powered interview preparation platform', 20)).toBe(
      'InterviewGPT is an A...'
    );
  });

  it('formats dates properly', () => {
    const d = new Date('2026-07-29T00:00:00Z');
    expect(formatDate(d)).toContain('2026');
  });
});
