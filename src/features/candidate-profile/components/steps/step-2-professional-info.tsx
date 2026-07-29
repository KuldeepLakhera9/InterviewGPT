'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CandidateProfileData, WorkModel } from '../../types/candidate-profile.types';

interface Step2Props {
  form: UseFormReturn<CandidateProfileData, unknown, CandidateProfileData>;
}

export function Step2ProfessionalInfo({ form }: Step2Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentWorkModel = watch('professionalInfo.preferredWorkModel');

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
          2. Professional Information
        </CardTitle>
        <CardDescription className="text-xs text-[var(--text-secondary)]">
          Detail your current professional status, experience level, and work preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Current / Most Recent Role <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register('professionalInfo.currentRole')}
              placeholder="e.g. Senior Frontend Engineer"
              className={errors.professionalInfo?.currentRole ? 'border-rose-500' : ''}
            />
            {errors.professionalInfo?.currentRole && (
              <p className="text-[11px] text-rose-400">
                {errors.professionalInfo.currentRole.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Current / Most Recent Company
            </label>
            <Input
              {...register('professionalInfo.currentCompany')}
              placeholder="e.g. Acme Tech Corp"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Years of Experience <span className="text-rose-400">*</span>
            </label>
            <Input
              type="number"
              min={0}
              max={60}
              {...register('professionalInfo.yearsOfExperience', { valueAsNumber: true })}
              placeholder="e.g. 5"
              className={errors.professionalInfo?.yearsOfExperience ? 'border-rose-500' : ''}
            />
            {errors.professionalInfo?.yearsOfExperience && (
              <p className="text-[11px] text-rose-400">
                {errors.professionalInfo.yearsOfExperience.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Primary Industry <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register('professionalInfo.industry')}
              placeholder="e.g. Software & Cloud Solutions / Fintech"
              className={errors.professionalInfo?.industry ? 'border-rose-500' : ''}
            />
            {errors.professionalInfo?.industry && (
              <p className="text-[11px] text-rose-400">
                {errors.professionalInfo.industry.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Work Authorization Status <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register('professionalInfo.workAuthorization')}
              placeholder="e.g. US Citizen / Green Card / Authorized to work"
              className={errors.professionalInfo?.workAuthorization ? 'border-rose-500' : ''}
            />
            {errors.professionalInfo?.workAuthorization && (
              <p className="text-[11px] text-rose-400">
                {errors.professionalInfo.workAuthorization.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Notice Period / Availability
            </label>
            <Input
              {...register('professionalInfo.noticePeriod')}
              placeholder="e.g. Immediate / 2 Weeks / 30 Days"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">
            Preferred Work Setup <span className="text-rose-400">*</span>
          </label>
          <Select
            value={currentWorkModel || 'hybrid'}
            onValueChange={(val: WorkModel) => setValue('professionalInfo.preferredWorkModel', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select work model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote Only</SelectItem>
              <SelectItem value="hybrid">Hybrid (Office + Remote)</SelectItem>
              <SelectItem value="onsite">Onsite Only</SelectItem>
              <SelectItem value="flexible">Flexible / Open to Any</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
