'use client';

import * as React from 'react';

export interface UseSpeechSynthesisOptions {
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [speechSpeed, setSpeechSpeed] = React.useState(1.0); // 0.8 - 1.2
  const [availableVoices, setAvailableVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<SpeechSynthesisVoice | null>(null);

  // Load browser voices
  React.useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoice) {
        // Pick natural english voice by preference
        const englishVoice =
          voices.find((v) => v.lang.includes('en-US') && v.name.includes('Natural')) ||
          voices.find((v) => v.lang.includes('en')) ||
          voices[0];
        setSelectedVoice(englishVoice);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, [selectedVoice]);

  // Speak text aloud
  const speak = React.useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechSpeed;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        if (options.onSpeakStart) options.onSpeakStart();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        if (options.onSpeakEnd) options.onSpeakEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [speechSpeed, selectedVoice, options]
  );

  // Pause speech
  const pause = React.useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  // Resume speech
  const resume = React.useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  // Immediate interrupt (stop speech when candidate speaks)
  const interrupt = React.useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  return {
    isSpeaking,
    isPaused,
    speechSpeed,
    setSpeechSpeed,
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    speak,
    pause,
    resume,
    interrupt,
  };
}
