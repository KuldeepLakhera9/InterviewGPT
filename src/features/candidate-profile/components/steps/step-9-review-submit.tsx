'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Award,
  Briefcase,
  Edit3,
  FileCode2,
  GraduationCap,
  Send,
  Sparkles,
  Target,
  User,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CandidateProfileData, StepStatus } from '../../types/candidate-profile.types';
import { ProfileCompletionBar } from '../profile-completion-bar';

interface Step9Props {
  form: UseFormReturn<CandidateProfileData, unknown, CandidateProfileData>;
  completionPercentage: number;
  stepStatuses: StepStatus[];
  onJumpToStep: (stepNumber: number) => void;
  onSubmitProfile: () => void;
  isSubmitting: boolean;
}

export function Step9ReviewSubmit({
  form,
  completionPercentage,
  stepStatuses,
  onJumpToStep,
  onSubmitProfile,
  isSubmitting,
}: Step9Props) {
  const data = form.getValues();

  const getStatusForStep = (stepNumber: number) => {
    return stepStatuses.find((s) => s.stepNumber === stepNumber)?.isCompleted ?? false;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <ProfileCompletionBar percentage={completionPercentage} />

      <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
              9. Review & Finalize Candidate Profile
            </CardTitle>
            <CardDescription className="text-xs text-[var(--text-secondary)]">
              Review your complete candidate profile details before final submission.
            </CardDescription>
          </div>
          <Button
            type="button"
            onClick={onSubmitProfile}
            disabled={isSubmitting}
            className="space-x-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Profile</span>
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Section 1: Personal Info */}
          <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  1. Personal Information
                </h4>
                <Badge
                  variant="outline"
                  className={
                    getStatusForStep(1)
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                  }
                >
                  {getStatusForStep(1) ? 'Complete' : 'Incomplete'}
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onJumpToStep(1)}
                className="h-7 text-xs text-blue-400 hover:text-blue-300"
              >
                <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div>
                <span className="text-[var(--text-secondary)]">Full Name: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.personalInfo.fullName || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Email: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.personalInfo.email || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Phone: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.personalInfo.phone || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Location: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.personalInfo.location || 'Not provided'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[var(--text-secondary)]">Headline: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.personalInfo.headline || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Info */}
          <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  2. Professional Information
                </h4>
                <Badge
                  variant="outline"
                  className={
                    getStatusForStep(2)
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                  }
                >
                  {getStatusForStep(2) ? 'Complete' : 'Incomplete'}
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onJumpToStep(2)}
                className="h-7 text-xs text-blue-400 hover:text-blue-300"
              >
                <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div>
                <span className="text-[var(--text-secondary)]">Current Role: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.professionalInfo.currentRole || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Company: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.professionalInfo.currentCompany || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Years of Experience: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.professionalInfo.yearsOfExperience} years
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Industry: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.professionalInfo.industry || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Work Authorization: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.professionalInfo.workAuthorization || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Preferred Work Setup: </span>
                <span className="font-medium text-[var(--text-primary)] capitalize">
                  {data.professionalInfo.preferredWorkModel}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Skills */}
          <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  3. Skills ({data.skillsInfo.skills.length})
                </h4>
                <Badge
                  variant="outline"
                  className={
                    getStatusForStep(3)
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                  }
                >
                  {getStatusForStep(3) ? 'Complete' : 'Incomplete'}
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onJumpToStep(3)}
                className="h-7 text-xs text-blue-400 hover:text-blue-300"
              >
                <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.skillsInfo.skills.length === 0 ? (
                <span className="text-xs text-[var(--text-secondary)]">No skills added</span>
              ) : (
                data.skillsInfo.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="text-xs">
                    {skill.name} ({skill.proficiency})
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Section 4 & 5 Grid: Education & Experience */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Education */}
            <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">4. Education</h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onJumpToStep(4)}
                  className="h-7 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {data.educationInfo.educationList.length} degree(s) added.
              </p>
            </div>

            {/* Experience */}
            <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    5. Experience
                  </h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onJumpToStep(5)}
                  className="h-7 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {data.experienceInfo.experienceList.length} position(s) added.
              </p>
            </div>
          </div>

          {/* Section 6 & 7 Grid: Projects & Certifications */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Projects */}
            <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <div className="flex items-center space-x-2">
                  <FileCode2 className="h-4 w-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">6. Projects</h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onJumpToStep(6)}
                  className="h-7 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {data.projectsInfo.projectList.length} project(s) added.
              </p>
            </div>

            {/* Certifications */}
            <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    7. Certifications
                  </h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onJumpToStep(7)}
                  className="h-7 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {data.certificationsInfo.certificationList.length} certificate(s) added.
              </p>
            </div>
          </div>

          {/* Section 8: Career Goals */}
          <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  8. Career Goals
                </h4>
                <Badge
                  variant="outline"
                  className={
                    getStatusForStep(8)
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                  }
                >
                  {getStatusForStep(8) ? 'Complete' : 'Incomplete'}
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onJumpToStep(8)}
                className="h-7 text-xs text-blue-400 hover:text-blue-300"
              >
                <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div>
                <span className="text-[var(--text-secondary)]">Target Role: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.careerGoalsInfo.targetRole || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Target Industry: </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {data.careerGoalsInfo.targetIndustry || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              onClick={onSubmitProfile}
              disabled={isSubmitting}
              className="w-full space-x-2 bg-emerald-600 px-8 py-5 text-sm font-semibold text-white hover:bg-emerald-500 sm:w-auto"
            >
              {isSubmitting ? (
                <span>Submitting Profile...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Submit Candidate Profile</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
