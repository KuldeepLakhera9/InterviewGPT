'use client';

import * as React from 'react';
import { Rocket, Clock } from 'lucide-react';
import type { ProjectRecommendationData } from '../../types/career.types';
import { cn } from '@/lib/utils';

interface ProjectRecommendationCardProps {
  projects: ProjectRecommendationData[];
}

export function ProjectRecommendationCard({ projects }: ProjectRecommendationCardProps) {
  return (
    <div
      id="project-recommendation-container"
      className="space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center space-x-2">
          <Rocket className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Portfolio Project Recommendation Engine
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Tailored portfolio projects designed to eliminate skill gaps and maximize resume
              recruiter impact.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4 shadow-sm transition-all hover:border-indigo-500/40"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'rounded border px-2 py-0.5 text-[10px] font-bold uppercase',
                    project.difficulty === 'advanced'
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  )}
                >
                  {project.difficulty}
                </span>

                <span className="flex items-center space-x-1 text-[11px] text-gray-400">
                  <Clock className="h-3 w-3 text-indigo-400" />
                  <span>{project.estimatedDuration}</span>
                </span>
              </div>

              <h4 className="text-sm leading-snug font-bold text-white">{project.title}</h4>
              <p className="text-xs leading-relaxed text-gray-300">{project.description}</p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 border-t border-[var(--border-subtle)] pt-2 text-[11px]">
              <span className="block font-bold text-emerald-400">Resume Impact:</span>
              <p className="text-gray-300 italic">{project.resumeImpact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
