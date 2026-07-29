'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { CandidateProfileData, EducationEntry } from '../../types/candidate-profile.types';

interface Step4Props {
  form: UseFormReturn<CandidateProfileData, unknown, CandidateProfileData>;
}

export function Step4Education({ form }: Step4Props) {
  const { watch, setValue } = form;
  const educationList: EducationEntry[] = watch('educationInfo.educationList') || [];

  const addEducation = () => {
    const newEntry: EducationEntry = {
      id: `edu_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      degree: '',
      fieldOfStudy: '',
      institution: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false,
      grade: '',
    };
    setValue('educationInfo.educationList', [...educationList, newEntry], { shouldValidate: true });
  };

  const removeEducation = (id: string) => {
    const updated = educationList.filter((e) => e.id !== id);
    setValue('educationInfo.educationList', updated, { shouldValidate: true });
  };

  const updateEducationField = (
    id: string,
    field: keyof EducationEntry,
    value: string | boolean
  ) => {
    const updated = educationList.map((entry) => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setValue('educationInfo.educationList', updated, { shouldValidate: true });
  };

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            4. Education History
          </CardTitle>
          <CardDescription className="text-xs text-[var(--text-secondary)]">
            Add academic degrees, diplomas, and institutional qualifications.
          </CardDescription>
        </div>
        <Button type="button" size="sm" onClick={addEducation} className="space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {educationList.length === 0 ? (
          <div className="space-y-3 rounded-lg border border-dashed border-[var(--border-subtle)] p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                No Education Entries Added
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Click the button above to add your degree or academic achievements.
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addEducation}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add First Degree
            </Button>
          </div>
        ) : (
          educationList.map((item, index) => (
            <div
              key={item.id}
              className="relative space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  Education #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(item.id)}
                  className="h-7 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Degree Title
                  </label>
                  <Input
                    value={item.degree}
                    onChange={(e) => updateEducationField(item.id, 'degree', e.target.value)}
                    placeholder="e.g. B.S. Computer Science"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Field of Study
                  </label>
                  <Input
                    value={item.fieldOfStudy}
                    onChange={(e) => updateEducationField(item.id, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g. Software Engineering"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Institution / University Name
                  </label>
                  <Input
                    value={item.institution}
                    onChange={(e) => updateEducationField(item.id, 'institution', e.target.value)}
                    placeholder="e.g. Stanford University"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Start Year / Date
                  </label>
                  <Input
                    value={item.startDate}
                    onChange={(e) => updateEducationField(item.id, 'startDate', e.target.value)}
                    placeholder="e.g. 2018"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    End Year / Graduation
                  </label>
                  <Input
                    value={item.endDate || ''}
                    disabled={item.isCurrentlyStudying}
                    onChange={(e) => updateEducationField(item.id, 'endDate', e.target.value)}
                    placeholder={item.isCurrentlyStudying ? 'Present' : 'e.g. 2022'}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1 sm:col-span-2">
                  <Checkbox
                    id={`currently_studying_${item.id}`}
                    checked={item.isCurrentlyStudying}
                    onCheckedChange={(checked) =>
                      updateEducationField(item.id, 'isCurrentlyStudying', Boolean(checked))
                    }
                  />
                  <label
                    htmlFor={`currently_studying_${item.id}`}
                    className="cursor-pointer text-xs font-medium text-[var(--text-secondary)]"
                  >
                    I am currently studying here
                  </label>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
