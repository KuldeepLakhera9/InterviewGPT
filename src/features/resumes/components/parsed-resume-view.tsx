'use client';

import * as React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Code2,
  Database,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Sparkles,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ParsedResumeRecord } from '../types/resume.types';
import type { ParsedResumeStructure } from '../parser/converters/structured-converter';

interface ParsedResumeViewProps {
  parsedResume: ParsedResumeRecord | null;
  isLoading: boolean;
  onReparse: () => Promise<void>;
}

export function ParsedResumeView({ parsedResume, isLoading, onReparse }: ParsedResumeViewProps) {
  const [isReparsing, setIsReparsing] = React.useState(false);

  const handleReparseClick = async () => {
    setIsReparsing(true);
    try {
      await onReparse();
    } finally {
      setIsReparsing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardContent className="space-y-3 p-8 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-400" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            Extracting text & parsing structured JSON...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!parsedResume) {
    return (
      <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardContent className="space-y-4 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              No Parsed Data Available
            </h3>
            <p className="mx-auto max-w-sm text-xs text-[var(--text-secondary)]">
              This resume has not been processed through the text extraction pipeline yet.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleReparseClick}
            disabled={isReparsing}
            className="space-x-1.5 bg-blue-600 text-xs text-white hover:bg-blue-500"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isReparsing ? 'Parsing...' : 'Parse Document Now'}</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const structured = (parsedResume.structuredData || {}) as unknown as ParsedResumeStructure;
  const scores = (parsedResume.confidenceScores || {}) as Record<string, number>;
  const overall = parsedResume.overallConfidence || 0;

  const getConfidenceBadgeColor = (val: number) => {
    if (val >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (val >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Confidence Scores */}
      <Card className="space-y-4 border border-blue-500/30 bg-[var(--bg-surface-1)] p-4">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Extraction Confidence Score
                </h3>
                <Badge
                  variant="outline"
                  className={`text-xs font-bold ${getConfidenceBadgeColor(overall)}`}
                >
                  {overall}% Certainty
                </Badge>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Evaluated field-level extraction certainty without judging candidate quality.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReparseClick}
            disabled={isReparsing}
            className="space-x-1.5 self-start text-xs sm:self-auto"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-blue-400 ${isReparsing ? 'animate-spin' : ''}`}
            />
            <span>{isReparsing ? 'Parsing...' : 'Re-parse Document'}</span>
          </Button>
        </div>

        {/* Field Confidence Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2.5">
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">Full Name</span>
            <div className="flex items-center justify-between font-bold">
              <span className="text-[var(--text-primary)]">
                {scores.fullName ? `${Math.round(scores.fullName * 100)}%` : '0%'}
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2.5">
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">
              Email Match
            </span>
            <div className="flex items-center justify-between font-bold">
              <span className="text-[var(--text-primary)]">
                {scores.email ? `${Math.round(scores.email * 100)}%` : '0%'}
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2.5">
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">
              Skills Certainty
            </span>
            <div className="flex items-center justify-between font-bold">
              <span className="text-[var(--text-primary)]">
                {scores.skills ? `${Math.round(scores.skills * 100)}%` : '0%'}
              </span>
              <Code2 className="h-3.5 w-3.5 text-blue-400" />
            </div>
          </div>

          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2.5">
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">
              Experience Certainty
            </span>
            <div className="flex items-center justify-between font-bold">
              <span className="text-[var(--text-primary)]">
                {scores.workExperience ? `${Math.round(scores.workExperience * 100)}%` : '0%'}
              </span>
              <Briefcase className="h-3.5 w-3.5 text-purple-400" />
            </div>
          </div>
        </div>
      </Card>

      {/* Main Extracted Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Personal Details & Skills */}
        <div className="space-y-6 lg:col-span-4">
          {/* Personal Details */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <User className="h-4 w-4 text-blue-400" />
                <span>Extracted Identity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <span className="block text-[11px] text-[var(--text-secondary)]">Full Name</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {structured.personalInfo?.fullName || 'Not Extracted'}
                </span>
              </div>

              {structured.personalInfo?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]" />
                  <span className="truncate text-[var(--text-primary)]">
                    {structured.personalInfo.email}
                  </span>
                </div>
              )}

              {structured.personalInfo?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-primary)]">
                    {structured.personalInfo.phone}
                  </span>
                </div>
              )}

              {structured.personalInfo?.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-primary)]">
                    {structured.personalInfo.location}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extracted Skills */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <Code2 className="h-4 w-4 text-blue-400" />
                <span>Extracted Skills ({(structured.skills || []).length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {(structured.skills || []).length === 0 ? (
                  <span className="text-xs text-[var(--text-secondary)]">No skills detected</span>
                ) : (
                  (structured.skills || []).map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="border-blue-500/20 bg-blue-500/10 text-xs text-blue-300"
                    >
                      {skill}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Experience, Education, Projects */}
        <div className="space-y-6 lg:col-span-8">
          {/* Summary */}
          {structured.summary && (
            <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-[var(--text-primary)]">
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  {structured.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Work Experience */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <Briefcase className="h-4 w-4 text-purple-400" />
                <span>Work Experience ({(structured.workExperience || []).length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(structured.workExperience || []).length === 0 ? (
                <p className="text-xs text-[var(--text-secondary)]">
                  No work experience sections detected.
                </p>
              ) : (
                (structured.workExperience || []).map((exp) => (
                  <div
                    key={exp.id}
                    className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">
                        {exp.jobTitle}
                      </h4>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-blue-400">{exp.company}</p>
                    {exp.description && (
                      <p className="line-clamp-3 pt-1 text-[11px] text-[var(--text-secondary)]">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                <span>Education Background ({(structured.education || []).length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(structured.education || []).length === 0 ? (
                <p className="text-xs text-[var(--text-secondary)]">
                  No education entries detected.
                </p>
              ) : (
                (structured.education || []).map((edu) => (
                  <div
                    key={edu.id}
                    className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3"
                  >
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">{edu.degree}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{edu.institution}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
