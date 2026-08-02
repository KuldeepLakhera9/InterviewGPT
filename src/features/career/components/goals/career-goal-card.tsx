'use client';

import * as React from 'react';
import { Target, Building2, Briefcase, DollarSign, Calendar, MapPin, Plus } from 'lucide-react';
import type { CareerGoalData } from '../../types/career.types';
import { Button } from '@/components/ui/button';

interface CareerGoalCardProps {
  goals: CareerGoalData[];
  onAddGoalClick?: () => void;
}

export function CareerGoalCard({ goals, onAddGoalClick }: CareerGoalCardProps) {
  const primaryGoal = goals.find((g) => g.isPrimary) || goals[0];

  return (
    <div
      id="career-goal-card-container"
      className="space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-purple-400" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Active Career Target Profile
          </h3>
        </div>

        {onAddGoalClick && (
          <Button
            type="button"
            onClick={onAddGoalClick}
            variant="outline"
            size="sm"
            className="h-7 space-x-1 border-purple-500/30 bg-purple-500/10 text-xs text-purple-300 hover:bg-purple-500/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Career Goal</span>
          </Button>
        )}
      </div>

      {primaryGoal && (
        <div className="space-y-3 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-950/30 to-black/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="rounded-md border border-purple-500/30 bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300">
                Primary Goal
              </span>
              <h4 className="text-lg font-black text-white">{primaryGoal.targetRole}</h4>
            </div>

            <div className="flex items-center space-x-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
              <Building2 className="h-3.5 w-3.5" />
              <span>{primaryGoal.dreamCompany}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs sm:grid-cols-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <Briefcase className="h-4 w-4 shrink-0 text-purple-400" />
              <div>
                <span className="block text-[10px] text-gray-400">Experience</span>
                <span className="font-semibold text-white">{primaryGoal.experienceLevel}</span>
              </div>
            </div>

            {primaryGoal.salaryGoal && (
              <div className="flex items-center space-x-2 text-gray-300">
                <DollarSign className="h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <span className="block text-[10px] text-gray-400">Salary Target</span>
                  <span className="font-semibold text-emerald-300">{primaryGoal.salaryGoal}</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar className="h-4 w-4 shrink-0 text-blue-400" />
              <div>
                <span className="block text-[10px] text-gray-400">Timeline</span>
                <span className="font-semibold text-white">{primaryGoal.targetTimeline}</span>
              </div>
            </div>

            {primaryGoal.preferredLocation && (
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <span className="block text-[10px] text-gray-400">Location</span>
                  <span className="font-semibold text-white">{primaryGoal.preferredLocation}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
