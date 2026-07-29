'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, Trash2, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  CandidateProfileData,
  SkillCategory,
  SkillEntry,
  SkillProficiency,
} from '../../types/candidate-profile.types';

interface Step3Props {
  form: UseFormReturn<CandidateProfileData, unknown, CandidateProfileData>;
}

export function Step3Skills({ form }: Step3Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentSkills: SkillEntry[] = watch('skillsInfo.skills') || [];

  const [newSkillName, setNewSkillName] = React.useState('');
  const [newSkillCategory, setNewSkillCategory] = React.useState<SkillCategory>('primary');
  const [newSkillProficiency, setNewSkillProficiency] =
    React.useState<SkillProficiency>('advanced');

  const addSkill = () => {
    if (!newSkillName.trim()) return;

    const newEntry: SkillEntry = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillProficiency,
    };

    setValue('skillsInfo.skills', [...currentSkills, newEntry], { shouldValidate: true });
    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    const updated = currentSkills.filter((s) => s.id !== id);
    setValue('skillsInfo.skills', updated, { shouldValidate: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
          3. Skills & Proficiency
        </CardTitle>
        <CardDescription className="text-xs text-[var(--text-secondary)]">
          Add key technical competencies, languages, frameworks, and developer tools.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Add Skill Input Card */}
        <div className="space-y-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
          <label className="flex items-center space-x-1.5 text-xs font-semibold text-[var(--text-primary)]">
            <Wrench className="h-3.5 w-3.5 text-blue-400" />
            <span>Add New Skill</span>
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Skill name (e.g. React, TypeScript, System Design)"
                className="h-9 text-xs"
              />
            </div>
            <div className="sm:col-span-3">
              <Select
                value={newSkillCategory}
                onValueChange={(val: SkillCategory) => setNewSkillCategory(val)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Skill</SelectItem>
                  <SelectItem value="secondary">Secondary Skill</SelectItem>
                  <SelectItem value="tool">Tool / Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-3">
              <Select
                value={newSkillProficiency}
                onValueChange={(val: SkillProficiency) => setNewSkillProficiency(val)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-end sm:col-span-1">
              <Button
                type="button"
                size="sm"
                onClick={addSkill}
                className="h-9 w-full px-3 sm:w-auto"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {errors.skillsInfo?.skills && (
          <p className="text-[11px] text-rose-400">{errors.skillsInfo.skills.message}</p>
        )}

        {/* Existing Skills List */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[var(--text-primary)]">
            Added Skills ({currentSkills.length})
          </h4>

          {currentSkills.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border-subtle)] p-6 text-center text-xs text-[var(--text-secondary)]">
              No skills added yet. Type a skill name above and click Add or press Enter.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center space-x-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 py-1.5 text-xs transition-all hover:border-blue-500/40"
                >
                  <span className="font-medium text-[var(--text-primary)]">{skill.name}</span>

                  <Badge
                    variant="outline"
                    className="border-blue-500/20 bg-blue-500/10 px-1.5 py-0 text-[10px] text-blue-400 capitalize"
                  >
                    {skill.proficiency}
                  </Badge>

                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="ml-1 text-[var(--text-secondary)] transition-colors hover:text-rose-400"
                    aria-label={`Remove ${skill.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
