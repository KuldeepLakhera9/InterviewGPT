'use client';

import * as React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';
import type { SkillGraphData } from '../../types/career.types';
import { cn } from '@/lib/utils';

interface InteractiveSkillGraphProps {
  skillGraph: SkillGraphData;
}

export function InteractiveSkillGraph({ skillGraph }: InteractiveSkillGraphProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Skill Domains' },
    { id: 'programming_languages', label: 'Languages' },
    { id: 'frameworks', label: 'Frameworks' },
    { id: 'databases', label: 'Databases' },
    { id: 'system_design', label: 'System Design' },
    { id: 'dsa', label: 'DSA & Algorithms' },
    { id: 'communication', label: 'Communication' },
  ];

  const filteredSkills =
    selectedCategory === 'all'
      ? skillGraph.skills
      : skillGraph.skills.filter((s) => s.category === selectedCategory);

  return (
    <div
      id="interactive-skill-graph-container"
      className="space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm"
    >
      <div className="flex flex-col items-start justify-between space-y-2 border-b border-[var(--border-subtle)] pb-3 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Layers className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Living Candidate Skill Graph
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Evidence-backed skill proficiencies derived from resume analysis and AI mock interview
              evaluations.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
          <span>Overall Proficiency: {skillGraph.overallScore}%</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 font-semibold whitespace-nowrap transition-all',
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skill Cards Grid */}
      <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            className="space-y-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4 shadow-sm transition-all hover:border-purple-500/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-primary)]">{skill.name}</span>
              <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-300 capitalize">
                {skill.category.replace('_', ' ')}
              </span>
            </div>

            {/* Level Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                <span>Current Level:</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {skill.currentLevel}% (Target: {skill.targetLevel}%)
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700/40">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${skill.currentLevel}%` }}
                />
              </div>
            </div>

            {/* Evidence Badges */}
            <div className="flex flex-wrap gap-1 border-t border-[var(--border-subtle)] pt-1">
              {skill.evidenceSources.map((source, idx) => (
                <span
                  key={idx}
                  className="rounded border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-purple-300"
                >
                  <ShieldCheck className="mr-0.5 inline-block h-2.5 w-2.5 text-purple-400" />
                  {source}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
