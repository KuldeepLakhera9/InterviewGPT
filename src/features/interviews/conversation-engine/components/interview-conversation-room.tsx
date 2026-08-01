'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { ConversationEngineState } from '../types/conversation-engine.types';
import {
  getInterviewStateAction,
  startInterviewAction,
  submitCandidateTurnAction,
} from '../actions/conversation-engine.actions';
import { useSessionAutosave } from '../../session-management/hooks/use-session-autosave';
import { LiveInterviewWorkspace } from '../../live-interface/components/live-interview-workspace';

interface InterviewConversationRoomProps {
  sessionId: string;
  initialState?: ConversationEngineState;
}

export function InterviewConversationRoom({
  sessionId,
  initialState,
}: InterviewConversationRoomProps) {
  const { toast } = useToast();
  const [state, setState] = React.useState<ConversationEngineState | null>(initialState || null);
  const [isLoading, setIsLoading] = React.useState(!initialState);
  const [isSending, setIsSending] = React.useState(false);

  const { draftText, saveDraft, clearDraft, lastSavedAt } = useSessionAutosave(sessionId);
  const [messageInput, setMessageInput] = React.useState('');

  // Sync draftText on recovery
  React.useEffect(() => {
    if (draftText && !messageInput) {
      setMessageInput(draftText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftText]);

  const loadState = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getInterviewStateAction(sessionId);
      if (res.success && res.data) {
        setState(res.data);
      } else {
        const startRes = await startInterviewAction(sessionId);
        if (startRes.success && startRes.data) {
          setState(startRes.data);
        } else {
          toast({
            variant: 'danger',
            title: 'Interview Init Error',
            description: startRes.error || 'Failed to start interview conversation room.',
          });
        }
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An error occurred loading interview state.',
      });
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  React.useEffect(() => {
    if (!state) {
      loadState();
    }
  }, [loadState, state]);

  const handleSendTurn = async (textToSend?: string) => {
    const text = (textToSend || messageInput).trim();
    if (!text || isSending || !state || state.isCompleted) return;

    setIsSending(true);
    setMessageInput('');
    clearDraft();

    try {
      const res = await submitCandidateTurnAction(sessionId, text);
      if (res.success && res.data) {
        setState(res.data);
      } else {
        toast({
          variant: 'danger',
          title: 'Turn Error',
          description: res.error || 'Failed to submit response.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An error occurred sending response turn.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (val: string) => {
    setMessageInput(val);
    saveDraft(val);
  };

  if (isLoading || !state) {
    return (
      <div className="flex h-96 items-center justify-center space-x-2 text-xs text-[var(--text-secondary)]">
        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
        <span>Initializing Live Interview Workspace...</span>
      </div>
    );
  }

  return (
    <LiveInterviewWorkspace
      sessionId={sessionId}
      state={state}
      isSending={isSending}
      messageInput={messageInput}
      onInputChange={handleInputChange}
      onSendTurn={handleSendTurn}
      onStatusChange={loadState}
      lastSavedAt={lastSavedAt}
    />
  );
}
