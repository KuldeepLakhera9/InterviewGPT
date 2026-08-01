'use client';

import * as React from 'react';

const NOTES_PREFIX = 'interviewgpt_notes_';

export function useCandidateNotes(sessionId: string) {
  const [notesText, setNotesText] = React.useState<string>('');
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);

  const storageKey = `${NOTES_PREFIX}${sessionId}`;

  // Load existing notes on mount
  React.useEffect(() => {
    if (typeof window === 'undefined' || !sessionId) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNotesText(saved);
        setLastSavedAt(new Date());
      }
    } catch {
      // Storage unavailable
    }
  }, [sessionId, storageKey]);

  // Persist notes with debouncing
  const saveNotes = React.useCallback(
    (text: string) => {
      setNotesText(text);
      if (typeof window === 'undefined' || !sessionId) return;

      try {
        localStorage.setItem(storageKey, text);
        setLastSavedAt(new Date());
      } catch {
        // Storage full/unavailable
      }
    },
    [sessionId, storageKey]
  );

  const clearNotes = React.useCallback(() => {
    setNotesText('');
    setLastSavedAt(null);
    if (typeof window === 'undefined' || !sessionId) return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Storage unavailable
    }
  }, [sessionId, storageKey]);

  return {
    notesText,
    saveNotes,
    clearNotes,
    lastSavedAt,
  };
}
