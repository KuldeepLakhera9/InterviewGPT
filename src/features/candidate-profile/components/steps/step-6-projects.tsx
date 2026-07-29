'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FileCode2, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CandidateProfileData, ProjectEntry } from '../../types/candidate-profile.types';

interface Step6Props {
  form: UseFormReturn<CandidateProfileData, unknown, CandidateProfileData>;
}

export function Step6Projects({ form }: Step6Props) {
  const { watch, setValue } = form;
  const projectList: ProjectEntry[] = watch('projectsInfo.projectList') || [];
  const [techInputs, setTechInputs] = React.useState<Record<string, string>>({});

  const addProject = () => {
    const newEntry: ProjectEntry = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: '',
      description: '',
      techStack: [],
      repoUrl: '',
      liveUrl: '',
      role: '',
    };
    setValue('projectsInfo.projectList', [...projectList, newEntry], { shouldValidate: true });
  };

  const removeProject = (id: string) => {
    const updated = projectList.filter((p) => p.id !== id);
    setValue('projectsInfo.projectList', updated, { shouldValidate: true });
  };

  const updateProjectField = (id: string, field: keyof ProjectEntry, value: string | string[]) => {
    const updated = projectList.map((entry) => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setValue('projectsInfo.projectList', updated, { shouldValidate: true });
  };

  const addTechStackItem = (projId: string) => {
    const text = (techInputs[projId] || '').trim();
    if (!text) return;

    const proj = projectList.find((p) => p.id === projId);
    if (!proj) return;

    const updatedStack = Array.from(new Set([...(proj.techStack || []), text]));
    updateProjectField(projId, 'techStack', updatedStack);
    setTechInputs({ ...techInputs, [projId]: '' });
  };

  const removeTechStackItem = (projId: string, item: string) => {
    const proj = projectList.find((p) => p.id === projId);
    if (!proj) return;

    const updatedStack = (proj.techStack || []).filter((t) => t !== item);
    updateProjectField(projId, 'techStack', updatedStack);
  };

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            6. Featured Projects & Portfolio
          </CardTitle>
          <CardDescription className="text-xs text-[var(--text-secondary)]">
            Showcase key software projects, open source repositories, or architecture builds.
          </CardDescription>
        </div>
        <Button type="button" size="sm" onClick={addProject} className="space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {projectList.length === 0 ? (
          <div className="space-y-3 rounded-lg border border-dashed border-[var(--border-subtle)] p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
              <FileCode2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">No Projects Added</p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Highlight notable apps, tools, or open-source work you have built.
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addProject}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Project
            </Button>
          </div>
        ) : (
          projectList.map((item, index) => (
            <div
              key={item.id}
              className="relative space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  Project #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(item.id)}
                  className="h-7 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Project Title
                  </label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateProjectField(item.id, 'title', e.target.value)}
                    placeholder="e.g. AI-Powered Code Auditor / Real-Time Chat Engine"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Description
                  </label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateProjectField(item.id, 'description', e.target.value)}
                    placeholder="High-level overview of system design, performance metrics, and features..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Repository Link
                  </label>
                  <Input
                    value={item.repoUrl || ''}
                    onChange={(e) => updateProjectField(item.id, 'repoUrl', e.target.value)}
                    placeholder="https://github.com/org/repo"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Live Demo Link
                  </label>
                  <Input
                    value={item.liveUrl || ''}
                    onChange={(e) => updateProjectField(item.id, 'liveUrl', e.target.value)}
                    placeholder="https://myproject.com"
                  />
                </div>

                {/* Tech Stack Sub-Tags */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Technologies Used
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={techInputs[item.id] || ''}
                      onChange={(e) => setTechInputs({ ...techInputs, [item.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechStackItem(item.id);
                        }
                      }}
                      placeholder="Add tech (e.g. Next.js, Redis, Tailwind)"
                      className="h-8 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addTechStackItem(item.id)}
                      className="h-8 px-3 text-xs"
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(item.techStack || []).map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        aria-label={`Remove tech ${tech}`}
                        className="cursor-pointer text-[11px] hover:bg-rose-500/20 hover:text-rose-300"
                        onClick={() => removeTechStackItem(item.id, tech)}
                      >
                        {tech} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
