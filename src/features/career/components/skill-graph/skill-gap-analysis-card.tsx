'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { SkillGapAnalysisData } from '../../types/career.types';

interface SkillGapAnalysisCardProps {
  gapAnalysis: SkillGapAnalysisData;
}

export function SkillGapAnalysisCard({ gapAnalysis }: SkillGapAnalysisCardProps) {
  return (
    <div
      id="skill-gap-analysis-container"
      className="space-y-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold text-amber-200">
            Skill Deficit & Target Role Gap Analysis
          </h3>
        </div>

        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
          Target Role Readiness: {gapAnalysis.overallReadinessPercentage}%
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Missing Skills */}
        <div className="space-y-2 rounded-xl border border-amber-500/20 bg-black/40 p-4">
          <span className="block text-xs font-bold tracking-wider text-amber-300 uppercase">
            Missing Target Skills
          </span>
          <div className="space-y-2 text-xs">
            {gapAnalysis.missingSkills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-start justify-between border-b border-white/5 pb-2"
              >
                <div className="space-y-0.5">
                  <span className="block font-semibold text-white">{skill.name}</span>
                  <span className="text-[10px] text-gray-400">Importance: {skill.importance}</span>
                </div>
                <span className="rounded border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {skill.estimatedHoursToMaster} hrs
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Skills */}
        <div className="space-y-2 rounded-xl border border-amber-500/20 bg-black/40 p-4">
          <span className="block text-xs font-bold tracking-wider text-purple-300 uppercase">
            Weak Skills Requiring Polish
          </span>
          <div className="space-y-2 text-xs">
            {gapAnalysis.weakSkills.slice(0, 4).map((skill) => (
              <div key={skill.name} className="space-y-1 border-b border-white/5 pb-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">{skill.name}</span>
                  <span className="text-[10px] font-bold text-purple-300">
                    {skill.currentLevel}% → {skill.targetLevel}%
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 italic">{skill.suggestedPractice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
