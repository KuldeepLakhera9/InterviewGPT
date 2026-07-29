'use client';

import * as React from 'react';
import {
  BarChart3,
  CheckCircle2,
  PieChart,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ResumeAnalyticsData } from '../types/resume.types';
import { getResumeAnalyticsAction } from '../analytics/actions/analytics.actions';

interface ResumeAnalyticsDashboardProps {
  initialAnalytics?: ResumeAnalyticsData | null;
  resumeId?: string;
}

export function ResumeAnalyticsDashboard({
  initialAnalytics,
  resumeId,
}: ResumeAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = React.useState<ResumeAnalyticsData | null>(
    initialAnalytics || null
  );
  const [isLoading, setIsLoading] = React.useState(!initialAnalytics);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchAnalyticsData() {
      setIsLoading(true);
      try {
        const res = await getResumeAnalyticsAction(resumeId);
        if (isMounted && res.success && res.analytics) {
          setAnalytics(res.analytics);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchAnalyticsData();
    return () => {
      isMounted = false;
    };
  }, [resumeId]);

  if (isLoading || !analytics) {
    return (
      <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardContent className="space-y-3 p-12 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-400" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            Generating ATS history, keyword trends & profile completion analytics...
          </p>
        </CardContent>
      </Card>
    );
  }

  // 1. SVG Path calculation for ATS History Line/Area Chart
  const atsHistory = analytics.atsHistory;
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 30;

  const points = atsHistory.map((item, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / (atsHistory.length - 1);
    const y = chartHeight - padding - ((item.score - 40) * (chartHeight - padding * 2)) / 60;
    return { x, y, score: item.score, label: item.version };
  });

  const lineD = points.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const areaD = `${lineD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  // 2. Profile Completion Donut calculation
  const overallPct = analytics.overallCompletionPercentage;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (overallPct / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Banner Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Overall Completion */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Profile Completion
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-[var(--text-primary)]">
                  {analytics.overallCompletionPercentage}%
                </span>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400"
                >
                  Optimal
                </Badge>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <PieChart className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Current ATS Score */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Latest ATS Score
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-emerald-400">
                  {analytics.atsHistory[analytics.atsHistory.length - 1]?.score || 85}%
                </span>
                <span className="text-[10px] font-semibold text-emerald-400">+18% Gain</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Action Verb Power */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Action Verb Strength
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-amber-400">
                  {analytics.improvementTrends[analytics.improvementTrends.length - 1]
                    ?.actionVerbStrength || 94}
                  %
                </span>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-400"
                >
                  High Potency
                </Badge>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Zap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Domain Coverage */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Domain Skill Coverage
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-purple-400">83%</span>
                <span className="text-[10px] text-purple-300">5 Domains</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <BarChart3 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* CHART 1: ATS History Chart (Line/Area) */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)] lg:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
              <span className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>ATS Readability Evolution Chart</span>
              </span>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-300"
              >
                Score Progression
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SVG Line/Area Chart */}
            <div className="relative w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-auto w-full overflow-visible"
                role="img"
                aria-label="ATS History Line Chart showing score evolution over resume versions"
              >
                {/* Horizontal Gridlines */}
                {[50, 70, 90].map((val) => {
                  const y = chartHeight - padding - ((val - 40) * (chartHeight - padding * 2)) / 60;
                  return (
                    <g key={val}>
                      <line
                        x1={padding}
                        y1={y}
                        x2={chartWidth - padding}
                        y2={y}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="4 4"
                      />
                      <text x={padding - 8} y={y + 4} fill="gray" fontSize="9" textAnchor="end">
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Gradient Defs */}
                <defs>
                  <linearGradient id="atsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area Fill */}
                <path d={areaD} fill="url(#atsGradient)" />

                {/* Line Stroke */}
                <path
                  d={lineD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="#047857"
                      stroke="#10b981"
                      strokeWidth="2"
                      className="cursor-pointer transition-transform hover:scale-125"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      fill="#34d399"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {pt.score}%
                    </text>
                    <text x={pt.x} y={chartHeight - 8} fill="gray" fontSize="9" textAnchor="middle">
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* CHART 4: Profile Completion Donut & Breakdown Graph */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)] lg:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
              <PieChart className="h-4 w-4 text-blue-400" />
              <span>Profile Completion Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-6">
              {/* Radial Donut SVG */}
              <div className="relative flex items-center justify-center">
                <svg
                  className="h-28 w-28 -rotate-90 transform"
                  viewBox="0 0 100 100"
                  role="img"
                  aria-label={`Donut chart showing ${overallPct}% profile completion`}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-[var(--text-primary)]">
                    {overallPct}%
                  </span>
                  <span className="block text-[9px] text-[var(--text-secondary)]">Complete</span>
                </div>
              </div>

              {/* Top Sections Checklist */}
              <div className="flex-1 space-y-1.5 text-xs">
                {analytics.profileCompletionSections.slice(0, 4).map((sec, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="truncate text-[11px] text-[var(--text-secondary)]">
                      {sec.sectionName}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] ${sec.isComplete ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-400'}`}
                    >
                      {sec.completionPercentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CHART 2: Keyword Trend Chart (Bar Chart) */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)] lg:col-span-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
              <span className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                <span>Keyword Density & Match Growth</span>
              </span>
              <div className="flex items-center space-x-3 text-[10px]">
                <span className="flex items-center">
                  <span className="mr-1 h-2 w-2 rounded-full bg-zinc-600" /> Initial
                </span>
                <span className="flex items-center">
                  <span className="mr-1 h-2 w-2 rounded-full bg-purple-500" /> Optimised
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {analytics.keywordTrends.map((kt, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-[var(--text-primary)]">{kt.category}</span>
                  <span className="text-[var(--text-secondary)]">
                    {kt.originalCount} → {kt.optimisedCount} keywords
                  </span>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface-2)]">
                  <div
                    style={{ width: `${(kt.originalCount / 10) * 100}%` }}
                    className="bg-zinc-600 transition-all duration-500"
                  />
                  <div
                    style={{ width: `${((kt.optimisedCount - kt.originalCount) / 10) * 100}%` }}
                    className="bg-purple-500 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CHART 5: Skill Coverage Chart */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)] lg:col-span-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
              <Target className="h-4 w-4 text-blue-400" />
              <span>Technical Domain Skill Coverage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {analytics.skillCoverageDomains.map((dom, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-[var(--text-primary)]">{dom.domain}</span>
                  <span className="font-bold text-blue-400">{dom.coveragePercentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface-2)]">
                  <div
                    style={{ width: `${dom.coveragePercentage}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CHART 3: Resume Improvement Trend */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)] lg:col-span-12">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Resume Content Improvement & Impact Gains</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-4">
              {analytics.improvementTrends.map((trend, i) => (
                <div
                  key={i}
                  className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4"
                >
                  <span className="block text-xs font-bold text-[var(--text-primary)]">
                    {trend.version}
                  </span>
                  <div className="space-y-1">
                    <span className="block text-xs text-[var(--text-secondary)]">
                      Verb Potency:{' '}
                      <strong className="text-amber-400">{trend.actionVerbStrength}%</strong>
                    </span>
                    <span className="block text-xs text-[var(--text-secondary)]">
                      Metrics Added:{' '}
                      <strong className="text-emerald-400">{trend.measurableMetricsCount}</strong>
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" /> +{trend.impactGain}% Impact Gain
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
