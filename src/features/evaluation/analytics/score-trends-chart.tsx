'use client';

import * as React from 'react';
import type { ScoreTrendPoint } from '../types/evaluation.types';

interface ScoreTrendsChartProps {
  trends: ScoreTrendPoint[];
}

export function ScoreTrendsChart({ trends }: ScoreTrendsChartProps) {
  if (trends.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-[var(--text-secondary)]">
        No historical trend data recorded yet.
      </div>
    );
  }

  const height = 180;
  const width = 500;
  const padding = 30;

  const pointsCount = trends.length;
  const stepX = (width - padding * 2) / Math.max(1, pointsCount - 1);

  const getY = (score: number) => {
    const minScore = 50;
    const maxScore = 100;
    const normalized = (score - minScore) / (maxScore - minScore);
    return height - padding - normalized * (height - padding * 2);
  };

  const overallPath = trends
    .map((t, i) => `${padding + i * stepX},${getY(t.overallScore)}`)
    .join(' L ');

  const technicalPath = trends
    .map((t, i) => `${padding + i * stepX},${getY(t.technicalScore)}`)
    .join(' L ');

  return (
    <div id="score-trends-chart" className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-end space-x-4 text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
          <span className="text-[var(--text-secondary)]">Overall Score</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-[var(--text-secondary)]">Technical Score</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
          {/* Grid lines */}
          {[60, 70, 80, 90, 100].map((score) => (
            <g key={score}>
              <line
                x1={padding}
                y1={getY(score)}
                x2={width - padding}
                y2={getY(score)}
                stroke="currentColor"
                strokeOpacity={0.15}
                strokeDasharray="3 3"
                className="text-[var(--border-subtle)]"
              />
              <text
                x={padding - 8}
                y={getY(score) + 3}
                fontSize="9"
                textAnchor="end"
                className="fill-[var(--text-tertiary)]"
              >
                {score}
              </text>
            </g>
          ))}

          {/* Technical Trend Line */}
          <path
            d={`M ${technicalPath}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Overall Trend Line */}
          <path d={`M ${overallPath}`} fill="none" stroke="#a855f7" strokeWidth="3" />

          {/* Dots and Labels */}
          {trends.map((t, i) => {
            const x = padding + i * stepX;
            const yOverall = getY(t.overallScore);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={yOverall}
                  r="4"
                  fill="#a855f7"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={height - 8}
                  fontSize="9"
                  textAnchor="middle"
                  className="fill-[var(--text-secondary)]"
                >
                  {t.date.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
