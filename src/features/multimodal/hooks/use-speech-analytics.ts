'use client';

import * as React from 'react';
import type { SpeechMetricsData } from '../types/multimodal.types';

const FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'you know',
  'basically',
  'actually',
  'literally',
  'sort of',
  'kind of',
];

export function useSpeechAnalytics() {
  const [speechMetrics, setSpeechMetrics] = React.useState<SpeechMetricsData>({
    speakingPaceWpm: 135,
    totalWords: 0,
    averageResponseDurationSeconds: 0,
    pauseCount: 0,
    longPauseCount: 0,
    fillerCount: 0,
    fillerDensityPercentage: 0,
    fillerWordsFound: [],
    speechConsistencyScore: 90,
    transcriptCompletenessScore: 95,
  });

  const turnsRef = React.useRef<Array<{ text: string; durationSeconds: number }>>([]);

  const recordTurnSpeech = React.useCallback((transcriptText: string, durationSeconds: number) => {
    if (!transcriptText.trim()) return;

    turnsRef.current.push({ text: transcriptText, durationSeconds });

    const allText = turnsRef.current.map((t) => t.text).join(' ');
    const totalWords = allText.split(/\s+/).filter(Boolean).length;
    const totalDurationSeconds = turnsRef.current.reduce((acc, t) => acc + t.durationSeconds, 0);

    const minutes = totalDurationSeconds > 0 ? totalDurationSeconds / 60 : 1;
    const speakingPaceWpm = Math.round(totalWords / minutes) || 135;
    const averageResponseDurationSeconds = Math.round(
      totalDurationSeconds / turnsRef.current.length
    );

    // Scan filler words
    const lowerText = allText.toLowerCase();
    const fillerMap: Record<string, number> = {};
    let totalFillers = 0;

    FILLER_WORDS.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        fillerMap[word] = matches.length;
        totalFillers += matches.length;
      }
    });

    const fillerWordsFound = Object.entries(fillerMap).map(([word, count]) => ({ word, count }));
    const fillerDensityPercentage =
      totalWords > 0 ? Number(((totalFillers / totalWords) * 100).toFixed(1)) : 0;

    setSpeechMetrics({
      speakingPaceWpm,
      totalWords,
      averageResponseDurationSeconds,
      pauseCount: Math.floor(turnsRef.current.length * 1.5),
      longPauseCount: Math.floor(turnsRef.current.length * 0.3),
      fillerCount: totalFillers,
      fillerDensityPercentage,
      fillerWordsFound,
      speechConsistencyScore: Math.max(60, 100 - fillerDensityPercentage * 5),
      transcriptCompletenessScore: 95,
    });
  }, []);

  return {
    speechMetrics,
    recordTurnSpeech,
    resetAnalytics: () => {
      turnsRef.current = [];
      setSpeechMetrics({
        speakingPaceWpm: 135,
        totalWords: 0,
        averageResponseDurationSeconds: 0,
        pauseCount: 0,
        longPauseCount: 0,
        fillerCount: 0,
        fillerDensityPercentage: 0,
        fillerWordsFound: [],
        speechConsistencyScore: 90,
        transcriptCompletenessScore: 95,
      });
    },
  };
}
