'use client';

import * as React from 'react';

export interface UseLiveVoiceOptions {
  onTranscriptUpdate?: (transcriptText: string, isFinal: boolean) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
}

export function useLiveVoice(options: UseLiveVoiceOptions = {}) {
  const [isListening, setIsListening] = React.useState(false);
  const [isPushToTalk, setIsPushToTalk] = React.useState(false);
  const [isMicAvailable, setIsMicAvailable] = React.useState(false);
  const [permissionError, setPermissionError] = React.useState<string | null>(null);
  const [currentTranscript, setCurrentTranscript] = React.useState('');
  const [audioLevel, setAudioLevel] = React.useState(0); // 0-100 gain level

  const recognitionRef = React.useRef<unknown>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const animFrameRef = React.useRef<number | null>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);

  // Initialize Microphone & Web Audio Analyser
  const requestMicAccess = React.useCallback(async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setIsMicAvailable(true);

      // Set up AudioContext for VAD (Voice Activity Detection)
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        // Start VAD Loop
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateAudioLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((avg / 128) * 100));
          setAudioLevel(normalized);

          if (normalized > 25 && options.onSpeechStart) {
            options.onSpeechStart();
          }

          animFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };
        updateAudioLevel();
      }

      return true;
    } catch (err: unknown) {
      console.warn('Microphone access denied or unequipped:', err);
      const errorMsg = err instanceof Error ? err.message : 'Microphone access denied';
      setPermissionError(errorMsg);
      setIsMicAvailable(false);
      return false;
    }
  }, [options]);

  // Start Speech Recognition
  const startListening = React.useCallback(async () => {
    if (!isMicAvailable) {
      const granted = await requestMicAccess();
      if (!granted) return;
    }

    const win = window as unknown as Record<
      string,
      new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: (e: {
          resultIndex: number;
          results: Array<Array<{ transcript: string }> & { isFinal: boolean }>;
        }) => void;
        onerror: (e: { error: string }) => void;
        onend: () => void;
        start: () => void;
        stop: () => void;
      }
    >;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = !isPushToTalk;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: {
          resultIndex: number;
          results: Array<Array<{ transcript: string }> & { isFinal: boolean }>;
        }) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript + '. ';
            } else {
              interim += transcript;
            }
          }

          const combined = (final + interim).trim();
          setCurrentTranscript(combined);

          if (options.onTranscriptUpdate) {
            options.onTranscriptUpdate(combined, Boolean(final));
          }
        };

        recognition.onerror = (e: { error: string }) => {
          console.warn('Speech recognition error:', e.error);
        };

        recognition.onend = () => {
          if (isListening && !isPushToTalk) {
            try {
              recognition.start();
            } catch {
              // ignore restart race conditions
            }
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    } else {
      setIsListening(true);
    }
  }, [isMicAvailable, isPushToTalk, options, requestMicAccess, isListening]);

  // Stop Speech Recognition
  const stopListening = React.useCallback(() => {
    if (recognitionRef.current) {
      try {
        (recognitionRef.current as { stop: () => void }).stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    if (options.onSpeechEnd) {
      options.onSpeechEnd();
    }
  }, [options]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (recognitionRef.current) {
        try {
          (recognitionRef.current as { stop: () => void }).stop();
        } catch {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isListening,
    isPushToTalk,
    setIsPushToTalk,
    isMicAvailable,
    permissionError,
    currentTranscript,
    audioLevel,
    requestMicAccess,
    startListening,
    stopListening,
    clearTranscript: () => setCurrentTranscript(''),
  };
}
