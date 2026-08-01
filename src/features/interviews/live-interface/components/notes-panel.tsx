'use client';

import * as React from 'react';
import { Edit3, Trash2, CheckCircle2, Copy } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCandidateNotes } from '../hooks/use-candidate-notes';

interface NotesPanelProps {
  sessionId: string;
}

export function NotesPanel({ sessionId }: NotesPanelProps) {
  const { toast } = useToast();
  const { notesText, saveNotes, clearNotes, lastSavedAt } = useCandidateNotes(sessionId);

  const handleCopy = () => {
    if (!notesText) return;
    navigator.clipboard.writeText(notesText);
    toast({ title: 'Notes Copied to Clipboard' });
  };

  return (
    <div className="flex h-full flex-col space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
        <div className="flex items-center space-x-1.5">
          <Edit3 className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-bold text-[var(--text-primary)]">Private Scratchpad Notes</h3>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!notesText}
            className="h-6 w-6 p-0 text-[var(--text-secondary)] hover:text-white"
          >
            <Copy className="h-3 w-3" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearNotes}
            disabled={!notesText}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Textarea Scratchpad */}
      <div className="min-h-[160px] flex-1">
        <Textarea
          placeholder="Use this private pad to outline STAR bullet points, algorithm steps, or system design trade-offs... (Only visible to you)"
          value={notesText}
          onChange={(e) => saveNotes(e.target.value)}
          className="h-full w-full resize-none border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-xs focus:ring-1 focus:ring-purple-400"
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 text-[10px] text-[var(--text-secondary)]">
        <span>{notesText.length} characters</span>

        {lastSavedAt ? (
          <span className="flex items-center space-x-1 text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Saved</span>
          </span>
        ) : (
          <span>Private & Auto-saved</span>
        )}
      </div>
    </div>
  );
}
