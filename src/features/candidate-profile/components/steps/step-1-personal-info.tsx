'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CandidateProfileData } from '../../types/candidate-profile.types';

interface Step1Props {
  form: UseFormReturn<CandidateProfileData, unknown, CandidateProfileData>;
}

export function Step1PersonalInfo({ form }: Step1Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
          1. Personal Information
        </CardTitle>
        <CardDescription className="text-xs text-[var(--text-secondary)]">
          Provide your core contact details, professional headline, and links.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register('personalInfo.fullName')}
              placeholder="e.g. Alex Chen"
              className={errors.personalInfo?.fullName ? 'border-rose-500' : ''}
            />
            {errors.personalInfo?.fullName && (
              <p className="text-[11px] text-rose-400">{errors.personalInfo.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <Input
              type="email"
              {...register('personalInfo.email')}
              placeholder="alex@example.com"
              className={errors.personalInfo?.email ? 'border-rose-500' : ''}
            />
            {errors.personalInfo?.email && (
              <p className="text-[11px] text-rose-400">{errors.personalInfo.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Phone Number</label>
            <Input {...register('personalInfo.phone')} placeholder="+1 (555) 123-4567" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Location</label>
            <Input
              {...register('personalInfo.location')}
              placeholder="San Francisco, CA / Remote"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">
            Professional Headline
          </label>
          <Input
            {...register('personalInfo.headline')}
            placeholder="e.g. Senior Full-Stack Software Engineer | React, Node.js & AI Systems"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Short Bio</label>
          <Textarea
            {...register('personalInfo.bio')}
            placeholder="Brief professional introduction detailing your primary background and domain focus..."
            className="min-h-[90px]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">
            Avatar / Photo URL
          </label>
          <Input
            {...register('personalInfo.avatarUrl')}
            placeholder="https://example.com/avatar.jpg"
            className={errors.personalInfo?.avatarUrl ? 'border-rose-500' : ''}
          />
          {errors.personalInfo?.avatarUrl && (
            <p className="text-[11px] text-rose-400">{errors.personalInfo.avatarUrl.message}</p>
          )}
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-3">
          <h4 className="mb-3 text-xs font-semibold text-[var(--text-primary)]">
            Online Presence & Links
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                Portfolio URL
              </label>
              <Input
                {...register('personalInfo.portfolioUrl')}
                placeholder="https://alexchen.dev"
                className={errors.personalInfo?.portfolioUrl ? 'border-rose-500' : ''}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                GitHub URL
              </label>
              <Input
                {...register('personalInfo.githubUrl')}
                placeholder="https://github.com/username"
                className={errors.personalInfo?.githubUrl ? 'border-rose-500' : ''}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                LinkedIn URL
              </label>
              <Input
                {...register('personalInfo.linkedinUrl')}
                placeholder="https://linkedin.com/in/username"
                className={errors.personalInfo?.linkedinUrl ? 'border-rose-500' : ''}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
