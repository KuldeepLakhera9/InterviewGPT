'use client';

import * as React from 'react';
import {
  BookOpen,
  Briefcase,
  Building,
  ExternalLink,
  History,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { JobMatchRecord } from '../types/resume.types';

interface JobMatchingViewProps {
  jobMatch: JobMatchRecord | null;
  history: JobMatchRecord[];
  isLoading: boolean;
  onCompare: (jdText: string, jobTitle?: string, companyName?: string) => Promise<void>;
  onSelectHistoryItem?: (item: JobMatchRecord) => void;
}

export function JobMatchingView({
  jobMatch,
  history,
  isLoading,
  onCompare,
  onSelectHistoryItem,
}: JobMatchingViewProps) {
  const [jobTitle, setJobTitle] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [jdText, setJdText] = React.useState('');
  const [isComparing, setIsComparing] = React.useState(false);

  const handleCompareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText || jdText.trim().length < 20) return;

    setIsComparing(true);
    try {
      await onCompare(jdText, jobTitle || 'Target Role', companyName || 'Target Company');
    } finally {
      setIsComparing(false);
    }
  };

  const getMatchBadgeColor = (pct: number) => {
    if (pct >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (pct >= 65) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Job Description Input Form */}
      <Card className="border border-blue-500/30 bg-gradient-to-b from-blue-950/20 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
            <Target className="h-4 w-4 text-blue-400" />
            <span>Target Job Description Matcher</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCompareSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--text-secondary)]">
                  Job Title (Optional)
                </label>
                <div className="relative">
                  <Briefcase className="absolute top-2.5 left-3 h-3.5 w-3.5 text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--text-secondary)]">
                  Company Name (Optional)
                </label>
                <div className="relative">
                  <Building className="absolute top-2.5 left-3 h-3.5 w-3.5 text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="e.g. Google / Stripe"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Job Description Text <span className="text-rose-400">*</span>
              </label>
              <Textarea
                placeholder="Paste full Job Description text here (responsibilities, required skills, qualifications)..."
                rows={4}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="font-mono text-xs"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isComparing || !jdText.trim() || jdText.trim().length < 20}
                className="space-x-2 bg-blue-600 px-6 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Sparkles className={`h-4 w-4 ${isComparing ? 'animate-spin' : ''}`} />
                <span>{isComparing ? 'Comparing...' : 'Compare Resume with Job Description'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading Skeleton Indicator */}
      {isLoading && (
        <Card className="space-y-3 border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-400" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            Evaluating Job Match %, keyword gaps, & learning recommendations...
          </p>
        </Card>
      )}

      {/* Report Output */}
      {jobMatch && !isLoading && (
        <div className="space-y-6">
          {/* Hero Overall Match Card */}
          <Card className="border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)]">
            <CardContent className="p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      {jobMatch.jobTitle} {jobMatch.companyName && `at ${jobMatch.companyName}`}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold ${getMatchBadgeColor(jobMatch.overallMatchPercentage)}`}
                    >
                      {jobMatch.overallMatchPercentage >= 80
                        ? 'Strong Match'
                        : 'Moderate Alignment'}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Compared on {new Date(jobMatch.createdAt).toLocaleDateString()} at{' '}
                    {new Date(jobMatch.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                      {jobMatch.overallMatchPercentage}%
                    </span>
                    <span className="block text-xs text-[var(--text-secondary)]">
                      Overall Match
                    </span>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500/20 border-t-blue-400 text-xs font-bold text-blue-300">
                    {jobMatch.overallMatchPercentage}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Grid: Missing Skills & Keyword Gaps */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Missing Skills & Learning Resources */}
            <div className="space-y-6 lg:col-span-5">
              {/* Missing Skills */}
              <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
                    <span className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-amber-400" />
                      <span>Missing Required Skills</span>
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {jobMatch.missingSkills.length} Skills
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {jobMatch.missingSkills.map((sk, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-xs text-amber-300"
                      >
                        {sk}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Learning Resources */}
              <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                    <BookOpen className="h-4 w-4 text-emerald-400" />
                    <span>Recommended Learning Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {jobMatch.recommendedLearningResources.map((res, i) => (
                    <div
                      key={i}
                      className="space-y-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--text-primary)]">{res.title}</span>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-300"
                        >
                          {res.platform}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">{res.reason}</p>
                      {res.link && (
                        <a
                          href={res.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 pt-1 text-[11px] text-blue-400 hover:underline"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Comparison History */}
              {history.length > 1 && (
                <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                      <History className="h-4 w-4 text-blue-400" />
                      <span>Comparison History ({history.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        onClick={() => onSelectHistoryItem && onSelectHistoryItem(h)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-xs ${
                          h.id === jobMatch.id
                            ? 'border-blue-500/40 bg-blue-500/10 font-bold text-blue-300'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-0.5 truncate">
                          <span className="block truncate font-semibold">{h.jobTitle}</span>
                          <span className="text-[10px] text-[var(--text-secondary)]">
                            {h.companyName}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${getMatchBadgeColor(h.overallMatchPercentage)}`}
                        >
                          {h.overallMatchPercentage}% Match
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Keyword Gaps & Recommended Improvements */}
            <div className="space-y-6 lg:col-span-7">
              {/* Keyword Gaps */}
              <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                    <Target className="h-4 w-4 text-purple-400" />
                    <span>Keyword Gaps & Terminology Gaps</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {jobMatch.keywordGaps.map((item, i) => (
                    <div
                      key={i}
                      className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-300">{item.keyword}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {item.significance}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommended Improvements */}
              <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                    <Lightbulb className="h-4 w-4 text-amber-400" />
                    <span>Recommended Resume Improvements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {jobMatch.recommendedImprovements.map((imp, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between space-x-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3"
                    >
                      <div className="space-y-1">
                        <span className="block text-[11px] font-semibold text-blue-400">
                          {imp.area}
                        </span>
                        <p className="text-[var(--text-secondary)]">{imp.suggestion}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[10px] ${
                          imp.impact === 'High'
                            ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {imp.impact} Impact
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
