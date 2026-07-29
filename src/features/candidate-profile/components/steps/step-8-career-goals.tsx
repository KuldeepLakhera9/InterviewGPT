'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CandidateProfileData } from '../../types/candidate-profile.types';

interface Step8Props {
  form: UseFormReturn<CandidateProfileData, unknown, CandidateProfileData>;
}

export function Step8CareerGoals({ form }: Step8Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const targetLocations: string[] = watch('careerGoalsInfo.targetLocations') || [];
  const [locationInput, setLocationInput] = React.useState('');

  const addLocation = () => {
    const text = locationInput.trim();
    if (!text) return;

    const updated = Array.from(new Set([...targetLocations, text]));
    setValue('careerGoalsInfo.targetLocations', updated, { shouldValidate: true });
    setLocationInput('');
  };

  const removeLocation = (loc: string) => {
    const updated = targetLocations.filter((l) => l !== loc);
    setValue('careerGoalsInfo.targetLocations', updated, { shouldValidate: true });
  };

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
          8. Career Goals & Aspirations
        </CardTitle>
        <CardDescription className="text-xs text-[var(--text-secondary)]">
          Define your target next steps, preferred company types, and long-term career vision.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Target Role Title <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register('careerGoalsInfo.targetRole')}
              placeholder="e.g. Lead Frontend Architect / Engineering Manager"
              className={errors.careerGoalsInfo?.targetRole ? 'border-rose-500' : ''}
            />
            {errors.careerGoalsInfo?.targetRole && (
              <p className="text-[11px] text-rose-400">
                {errors.careerGoalsInfo.targetRole.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Target Industry / Sector <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register('careerGoalsInfo.targetIndustry')}
              placeholder="e.g. Artificial Intelligence / Cloud Infrastructure"
              className={errors.careerGoalsInfo?.targetIndustry ? 'border-rose-500' : ''}
            />
            {errors.careerGoalsInfo?.targetIndustry && (
              <p className="text-[11px] text-rose-400">
                {errors.careerGoalsInfo.targetIndustry.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Desired Compensation Range
            </label>
            <Input
              {...register('careerGoalsInfo.desiredSalaryRange')}
              placeholder="e.g. $160,000 - $200,000 USD / Competitive"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Preferred Company Size / Tier
            </label>
            <Input
              {...register('careerGoalsInfo.preferredCompanySize')}
              placeholder="e.g. Series B Startup / Big Tech (FAANG) / Enterprise"
            />
          </div>
        </div>

        {/* Target Locations */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--text-secondary)]">
            Target Job Locations
          </label>
          <div className="flex space-x-2">
            <Input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLocation();
                }
              }}
              placeholder="Add target location (e.g. New York, Remote US, London)"
              className="h-9 text-xs"
            />
            <Button type="button" size="sm" onClick={addLocation} className="h-9 px-3 text-xs">
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {targetLocations.map((loc) => (
              <Badge
                key={loc}
                variant="outline"
                aria-label={`Remove location ${loc}`}
                className="cursor-pointer border-blue-500/20 bg-blue-500/10 text-[11px] text-blue-400 hover:border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-300"
                onClick={() => removeLocation(loc)}
              >
                {loc} ×
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">
            Short-Term Goal (Next 1-2 Years)
          </label>
          <Textarea
            {...register('careerGoalsInfo.shortTermGoal')}
            placeholder="e.g. Transition into AI application architecture and master distributed system design..."
            className="min-h-[75px]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">
            Long-Term Goal (5+ Years)
          </label>
          <Textarea
            {...register('careerGoalsInfo.longTermGoal')}
            placeholder="e.g. Lead engineering divisions or found a high-impact technology startup..."
            className="min-h-[75px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
