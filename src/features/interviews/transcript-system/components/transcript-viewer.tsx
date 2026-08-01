'use client';

import * as React from 'react';
import {
  Search,
  Download,
  FileText,
  Bot,
  User,
  Clock,
  Layers,
  Award,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import type {
  ExportFormat,
  InterviewTranscriptData,
  TurnSpeaker,
} from '../types/transcript-system.types';
import { exportTranscriptAction } from '../actions/transcript-system.actions';
import { cn } from '@/lib/utils';

interface TranscriptViewerProps {
  transcript: InterviewTranscriptData;
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [speakerFilter, setSpeakerFilter] = React.useState<TurnSpeaker | 'all'>('all');
  const [isExporting, setIsExporting] = React.useState(false);

  const filteredTurns = React.useMemo(() => {
    let list = transcript.turns;

    if (speakerFilter !== 'all') {
      list = list.filter((t) => t.speaker === speakerFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.messageText.toLowerCase().includes(q) ||
          (t.questionTitle && t.questionTitle.toLowerCase().includes(q)) ||
          (t.topic && t.topic.toLowerCase().includes(q))
      );
    }

    return list;
  }, [transcript.turns, speakerFilter, searchQuery]);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      const res = await exportTranscriptAction(transcript.metadata.sessionId, format);
      if (res.success && res.data) {
        // Trigger browser download
        const blob = new Blob([res.data.content], { type: res.data.contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: 'Export Successful',
          description: `Downloaded ${res.data.filename}`,
        });
      } else {
        toast({
          variant: 'danger',
          title: 'Export Failed',
          description: res.error || 'Failed to export transcript.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An error occurred during transcript export.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const { metadata } = transcript;

  return (
    <div className="space-y-4">
      {/* Transcript Header Summary */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center space-x-2 text-xl font-bold tracking-tight text-[var(--text-primary)]">
            <FileText className="h-5 w-5 text-blue-400" />
            <span>Interview Transcript Inspector</span>
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Full captured log of all questions, candidate responses, and turn metadata.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <Select onValueChange={(val) => handleExport(val as ExportFormat)} disabled={isExporting}>
            <SelectTrigger className="h-9 space-x-1.5 border-none bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500">
              <Download className="h-4 w-4" />
              <SelectValue placeholder="Export Transcript" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">Export as JSON (.json)</SelectItem>
              <SelectItem value="markdown">Export as Markdown (.md)</SelectItem>
              <SelectItem value="text">Export as Plain Text (.txt)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metadata Badges Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 text-xs shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase">Role Target</span>
            <p className="font-bold text-[var(--text-primary)]">
              {metadata.roleTitle} ({metadata.seniorityLevel.toUpperCase()})
            </p>
          </div>
          <div className="h-8 w-px bg-[var(--border-subtle)]" />
          <div className="space-y-0.5">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase">Company</span>
            <p className="font-bold text-purple-400">
              {metadata.companyName} ({metadata.companyTier.toUpperCase()})
            </p>
          </div>
          <div className="h-8 w-px bg-[var(--border-subtle)]" />
          <div className="space-y-0.5">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase">
              Track & Difficulty
            </span>
            <p className="font-bold text-emerald-400 capitalize">
              {metadata.track.replace('_', ' ')} • {metadata.difficulty}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-semibold text-[var(--text-secondary)]">
          <span>{metadata.totalTurns} Total Turns</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>{Math.round(metadata.elapsedSeconds / 60)}m Elapsed</span>
          </span>
        </div>
      </div>

      {/* Search & Speaker Filter Controls */}
      <div className="grid gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm sm:grid-cols-12">
        <div className="relative sm:col-span-8">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-[var(--text-secondary)]" />
          <Input
            placeholder="Search transcript content, questions, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[var(--bg-surface-2)] pl-9 text-xs"
          />
        </div>

        <div className="flex items-center justify-end space-x-1.5 sm:col-span-4">
          {(['all', 'interviewer', 'candidate'] as const).map((spk) => (
            <button
              key={spk}
              type="button"
              onClick={() => setSpeakerFilter(spk)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all',
                speakerFilter === spk
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
              )}
            >
              {spk}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Turns List */}
      <div className="space-y-3">
        {filteredTurns.length === 0 ? (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8 text-center text-xs text-[var(--text-secondary)]">
            No transcript turns match the search filter.
          </div>
        ) : (
          filteredTurns.map((t) => {
            const isInterviewer = t.speaker === 'interviewer';
            return (
              <div
                key={t.id}
                className={cn(
                  'space-y-2 rounded-xl border p-4 text-xs shadow-sm transition-all',
                  isInterviewer
                    ? 'border-blue-500/20 bg-blue-500/5'
                    : 'border-purple-500/20 bg-purple-500/5'
                )}
              >
                {/* Turn Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-surface-2)] text-[10px] font-bold text-[var(--text-secondary)]">
                      {t.turnIndex}
                    </span>
                    <span className="flex items-center space-x-1 font-bold">
                      {isInterviewer ? (
                        <>
                          <Bot className="h-4 w-4 text-blue-400" />
                          <span className="text-blue-300">AI Lead Interviewer</span>
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 text-purple-400" />
                          <span className="text-purple-300">Candidate</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-[var(--text-secondary)]">
                    <span className="rounded bg-[var(--bg-surface-2)] px-2 py-0.5 font-medium uppercase">
                      {t.phase}
                    </span>
                    <span>
                      {new Date(t.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Linked Question Target Banner if present */}
                {t.questionTitle && (
                  <div className="space-y-0.5 rounded-lg bg-[var(--bg-surface-2)] p-2.5 text-[11px]">
                    <span className="flex items-center space-x-1 font-bold text-blue-400">
                      <BookOpen className="h-3 w-3" />
                      <span>Target Question: {t.questionTitle}</span>
                    </span>
                    {t.questionText && (
                      <p className="truncate text-[var(--text-secondary)] italic">
                        {t.questionText}
                      </p>
                    )}
                  </div>
                )}

                {/* Turn Message Text */}
                <p className="pt-1 leading-relaxed whitespace-pre-wrap text-[var(--text-primary)]">
                  {t.messageText}
                </p>

                {/* Metadata Notes Badges */}
                {(t.metadata?.extractedStrength || t.metadata?.extractedGap || t.topic) && (
                  <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-2 text-[11px]">
                    {t.topic && (
                      <span className="flex items-center space-x-1 rounded bg-blue-500/10 px-2 py-0.5 font-semibold text-blue-300">
                        <Layers className="h-3 w-3" />
                        <span>Topic: {t.topic}</span>
                      </span>
                    )}
                    {t.metadata?.extractedStrength && (
                      <span className="flex items-center space-x-1 rounded bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400">
                        <Award className="h-3 w-3" />
                        <span>Strength: {t.metadata.extractedStrength}</span>
                      </span>
                    )}
                    {t.metadata?.extractedGap && (
                      <span className="flex items-center space-x-1 rounded bg-amber-500/10 px-2 py-0.5 font-medium text-amber-300">
                        <AlertCircle className="h-3 w-3" />
                        <span>Gap: {t.metadata.extractedGap}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
