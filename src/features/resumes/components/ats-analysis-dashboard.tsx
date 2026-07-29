'use client';

import * as React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  CheckCircle2,
  Copy,
  Cpu,
  FileCheck,
  FileSpreadsheet,
  Lightbulb,
  RefreshCw,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import type { AtsAnalysisRecord } from '../types/resume.types';

interface AtsAnalysisDashboardProps {
  atsAnalysis: AtsAnalysisRecord | null;
  isLoading: boolean;
  onRunAtsAnalysis: () => Promise<void>;
}

export function AtsAnalysisDashboard({
  atsAnalysis,
  isLoading,
  onRunAtsAnalysis,
}: AtsAnalysisDashboardProps) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleAnalyzeClick = async () => {
    setIsAnalyzing(true);
    try {
      await onRunAtsAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    toast({
      title: 'Keyword Copied!',
      description: `Copied "${kw}" to clipboard.`,
    });
  };

  if (isLoading) {
    return (
      <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardContent className="space-y-3 p-12 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-purple-400" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            Running LLM ATS evaluation & formatting audit...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!atsAnalysis) {
    return (
      <Card className="border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)]">
        <CardContent className="space-y-4 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
            <Cpu className="h-7 w-7" />
          </div>
          <div className="mx-auto max-w-md space-y-2">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              ATS & Recruiter Evaluation Ready
            </h3>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              Analyze your active resume against Applicant Tracking System (ATS) parser algorithms
              and recruiter review metrics.
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
            className="space-x-2 bg-purple-600 px-6 text-xs font-semibold text-white shadow-md shadow-purple-500/20 hover:bg-purple-500"
          >
            <Sparkles className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Resume...' : 'Run ATS Analysis'}</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getImpactBadge = (impact: 'High' | 'Medium' | 'Low') => {
    if (impact === 'High')
      return (
        <Badge
          variant="outline"
          className="border-rose-500/30 bg-rose-500/10 text-[10px] text-rose-400"
        >
          High Impact
        </Badge>
      );
    if (impact === 'Medium')
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-400"
        >
          Medium Impact
        </Badge>
      );
    return (
      <Badge
        variant="outline"
        className="border-blue-500/30 bg-blue-500/10 text-[10px] text-blue-400"
      >
        Low Impact
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Dual Scores & Trigger */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {/* ATS Score Card */}
        <Card className="border border-purple-500/30 bg-gradient-to-b from-purple-950/30 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)] lg:col-span-5">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <FileCheck className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  ATS Readability Score
                </span>
              </div>
              <div className="flex items-baseline space-x-2 pt-1">
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                  {atsAnalysis.atsScore}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">/ 100</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold ${getScoreColor(atsAnalysis.atsScore)}`}
                >
                  {atsAnalysis.atsScore >= 80 ? 'Excellent' : 'Needs Tuning'}
                </Badge>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Evaluates keyword density & system parsing readability.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-purple-500/20 border-t-purple-400 text-xs font-bold text-purple-300">
              {atsAnalysis.atsScore}%
            </div>
          </CardContent>
        </Card>

        {/* Recruiter Impression Score Card */}
        <Card className="border border-blue-500/30 bg-gradient-to-b from-blue-950/30 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)] lg:col-span-5">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Recruiter Impression Score
                </span>
              </div>
              <div className="flex items-baseline space-x-2 pt-1">
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                  {atsAnalysis.recruiterScore}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">/ 100</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold ${getScoreColor(atsAnalysis.recruiterScore)}`}
                >
                  {atsAnalysis.recruiterScore >= 80 ? 'High Impact' : 'Moderate'}
                </Badge>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Evaluates career growth, leadership & metric quantification.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500/20 border-t-blue-400 text-xs font-bold text-blue-300">
              {atsAnalysis.recruiterScore}%
            </div>
          </CardContent>
        </Card>

        {/* Action Button Card */}
        <Card className="flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 lg:col-span-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
            className="flex h-full min-h-[80px] w-full flex-col items-center justify-center space-y-1 text-xs"
          >
            <RefreshCw className={`h-4 w-4 text-purple-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-analyze ATS'}</span>
          </Button>
        </Card>
      </div>

      {/* Main Grid: Missing Keywords & Weak Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Missing Keywords & Strengths */}
        <div className="space-y-6 lg:col-span-5">
          {/* Missing Keywords */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
                <span className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <span>Missing High-Value Keywords</span>
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {atsAnalysis.missingKeywords.length} Keywords
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-[11px] text-[var(--text-secondary)]">
                Click any keyword to copy to clipboard for incorporating into your skills or
                achievements.
              </p>
              <div className="flex flex-wrap gap-2">
                {atsAnalysis.missingKeywords.map((kw, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => copyKeyword(kw)}
                    className="group inline-flex cursor-pointer items-center space-x-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/20"
                  >
                    <span>{kw}</span>
                    <Copy className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Strengths */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <Award className="h-4 w-4 text-emerald-400" />
                <span>Resume Strengths</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {atsAnalysis.strengths.map((str, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-[var(--text-secondary)]">{str}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Weak Sections & Actionable Suggestions */}
        <div className="space-y-6 lg:col-span-7">
          {/* Weak Sections */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <span>Weak or Underdeveloped Sections</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {atsAnalysis.weakSections.map((item, i) => (
                <div
                  key={i}
                  className="space-y-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">{item.section}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Issue:</strong> {item.issue}
                  </p>
                  <p className="text-[11px] text-emerald-400">
                    <strong>Recommendation:</strong> {item.recommendation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actionable Suggestions */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>Actionable Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {atsAnalysis.suggestions.map((sug, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between space-x-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="block text-[11px] font-semibold text-blue-400">
                      {sug.category}
                    </span>
                    <p className="text-[var(--text-secondary)]">{sug.suggestion}</p>
                  </div>
                  {getImpactBadge(sug.impact)}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Formatting Feedback Checklist */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <FileSpreadsheet className="h-4 w-4 text-blue-400" />
                <span>Formatting & Layout Audit</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {atsAnalysis.formattingFeedback.map((fmt, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between rounded-lg border border-[var(--border-subtle)] p-2.5 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[var(--text-primary)]">{fmt.item}</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">{fmt.details}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-[10px] font-bold ${
                      fmt.status === 'Pass'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : fmt.status === 'Warning'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                          : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {fmt.status === 'Pass' && <CheckCircle2 className="mr-1 inline h-3 w-3" />}
                    {fmt.status === 'Warning' && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                    {fmt.status === 'Fail' && <AlertCircle className="mr-1 inline h-3 w-3" />}
                    {fmt.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
