'use client';

import * as React from 'react';

const DRAFT_PREFIX = 'interviewgpt_draft_';

export function useSessionAutosave(sessionId: string) {
  const [draftText, setDraftText] = React.useState('');
  const [isRestored, setIsRestored] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null);

  // Restore draft on mount
  React.useEffect(() => {
    if (!sessionId) return;
    try {
      const saved = localStorage.getItem(`${DRAFT_PREFIX}${sessionId}`);
      if (saved) {
        setDraftText(saved);
        setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch {
      // LocalStorage access error
    } finally {
      setIsRestored(true);
    }
  }, [sessionId]);

  // Persist draft on change
  const saveDraft = React.useCallback(
    (text: string) => {
      setDraftText(text);
      if (!sessionId) return;
      try {
        if (text.trim()) {
          localStorage.setItem(`${DRAFT_PREFIX}${sessionId}`, text);
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else {
          localStorage.removeItem(`${DRAFT_PREFIX}${sessionId}`);
          setLastSavedAt(null);
        }
      } catch {
        // Storage write error
      }
    },
    [sessionId]
  );

  const clearDraft = React.useCallback(() => {
    setDraftText('');
    setLastSavedAt(null);
    if (!sessionId) return;
    try {
      localStorage.removeItem(`${DRAFT_PREFIX}${sessionId}`);
    } catch {
      // Storage remove error
    }
  }, [sessionId]);

  return {
    draftText,
    saveDraft,
    clearDraft,
    isRestored,
    lastSavedAt,
  };
}
