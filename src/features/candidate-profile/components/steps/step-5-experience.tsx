'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { CandidateProfileData, ExperienceEntry } from '../../types/candidate-profile.types';

interface Step5Props {
  form: UseFormReturn<CandidateProfileData, unknown, CandidateProfileData>;
}

export function Step5Experience({ form }: Step5Props) {
  const { watch, setValue } = form;
  const experienceList: ExperienceEntry[] = watch('experienceInfo.experienceList') || [];

  const addExperience = () => {
    const newEntry: ExperienceEntry = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      description: '',
    };
    setValue('experienceInfo.experienceList', [...experienceList, newEntry], {
      shouldValidate: true,
    });
  };

  const removeExperience = (id: string) => {
    const updated = experienceList.filter((e) => e.id !== id);
    setValue('experienceInfo.experienceList', updated, { shouldValidate: true });
  };

  const updateExperienceField = (
    id: string,
    field: keyof ExperienceEntry,
    value: string | boolean
  ) => {
    const updated = experienceList.map((entry) => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setValue('experienceInfo.experienceList', updated, { shouldValidate: true });
  };

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            5. Work Experience
          </CardTitle>
          <CardDescription className="text-xs text-[var(--text-secondary)]">
            Add relevant work positions, responsibilities, and key accomplishments.
          </CardDescription>
        </div>
        <Button type="button" size="sm" onClick={addExperience} className="space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add Position</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {experienceList.length === 0 ? (
          <div className="space-y-3 rounded-lg border border-dashed border-[var(--border-subtle)] p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                No Work Experience Added
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Click above to add previous jobs, internships, or freelance roles.
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addExperience}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Position
            </Button>
          </div>
        ) : (
          experienceList.map((item, index) => (
            <div
              key={item.id}
              className="relative space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  Position #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(item.id)}
                  className="h-7 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Job Title
                  </label>
                  <Input
                    value={item.jobTitle}
                    onChange={(e) => updateExperienceField(item.id, 'jobTitle', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Company Name
                  </label>
                  <Input
                    value={item.company}
                    onChange={(e) => updateExperienceField(item.id, 'company', e.target.value)}
                    placeholder="e.g. Google / Stripe"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Location
                  </label>
                  <Input
                    value={item.location || ''}
                    onChange={(e) => updateExperienceField(item.id, 'location', e.target.value)}
                    placeholder="e.g. Mountain View, CA / Remote"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Start Date
                  </label>
                  <Input
                    value={item.startDate}
                    onChange={(e) => updateExperienceField(item.id, 'startDate', e.target.value)}
                    placeholder="e.g. Jan 2021"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    End Date
                  </label>
                  <Input
                    value={item.endDate || ''}
                    disabled={item.isCurrentRole}
                    onChange={(e) => updateExperienceField(item.id, 'endDate', e.target.value)}
                    placeholder={item.isCurrentRole ? 'Present' : 'e.g. Present / Dec 2023'}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1 sm:col-span-2">
                  <Checkbox
                    id={`current_role_${item.id}`}
                    checked={item.isCurrentRole}
                    onCheckedChange={(checked) =>
                      updateExperienceField(item.id, 'isCurrentRole', Boolean(checked))
                    }
                  />
                  <label
                    htmlFor={`current_role_${item.id}`}
                    className="cursor-pointer text-xs font-medium text-[var(--text-secondary)]"
                  >
                    I currently work in this role
                  </label>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Description & Key Accomplishments
                  </label>
                  <Textarea
                    value={item.description || ''}
                    onChange={(e) => updateExperienceField(item.id, 'description', e.target.value)}
                    placeholder="Architected microservices reducing latency by 35%..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
