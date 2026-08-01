'use client';

import * as React from 'react';

interface SkillRadarChartProps {
  data: { subject: string; score: number; fullMark: number }[];
}

export function SkillRadarChart({ data }: SkillRadarChartProps) {
  const size = 280;
  const center = size / 2;
  const radius = 95;
  const total = data.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = ((Math.PI * 2) / total) * index - Math.PI / 2;
    const factor = value / 100;
    const x = center + radius * factor * Math.cos(angle);
    const y = center + radius * factor * Math.sin(angle);
    return { x, y };
  };

  const points = data
    .map((d, idx) => {
      const { x, y } = getCoordinates(idx, d.score);
      return `${x},${y}`;
    })
    .join(' ');

  const gridCircles = [0.25, 0.5, 0.75, 1.0];

  return (
    <div id="skill-radar-chart-container" className="flex flex-col items-center justify-center p-4">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Circles */}
        {gridCircles.map((factor, idx) => (
          <polygon
            key={idx}
            points={data
              .map((_, i) => {
                const { x, y } = getCoordinates(i, factor * 100);
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth="1"
            className="text-[var(--border-strong)]"
          />
        ))}

        {/* Axes */}
        {data.map((_, idx) => {
          const { x, y } = getCoordinates(idx, 100);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.2}
              strokeWidth="1"
              className="text-[var(--border-strong)]"
            />
          );
        })}

        {/* Filled Skill Polygon */}
        <polygon
          points={points}
          fill="rgba(168, 85, 247, 0.25)"
          stroke="#a855f7"
          strokeWidth="2.5"
          className="transition-all duration-700"
        />

        {/* Radar Point Dots & Labels */}
        {data.map((d, idx) => {
          const { x, y } = getCoordinates(idx, d.score);
          const labelCoords = getCoordinates(idx, 120);

          return (
            <g key={idx}>
              <circle cx={x} cy={y} r="4" fill="#c084fc" stroke="#ffffff" strokeWidth="1.5" />
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="currentColor"
                fontSize="10"
                fontWeight="600"
                className="fill-current text-[var(--text-secondary)]"
              >
                {d.subject} ({d.score})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
