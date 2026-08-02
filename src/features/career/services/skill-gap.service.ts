import type { SkillGapAnalysisData, SkillGraphData } from '../types/career.types';

export function computeSkillGapAnalysis(
  skillGraph: SkillGraphData,
  _targetRole: string = 'Senior Full Stack Engineer'
): SkillGapAnalysisData {
  const missingSkills = [
    {
      name: 'Distributed Transaction Patterns (Saga / 2PC)',
      category: 'system_design' as const,
      importance: 'critical' as const,
      estimatedHoursToMaster: 12,
    },
    {
      name: 'GraphQL & Apollo Server Federation',
      category: 'frameworks' as const,
      importance: 'high' as const,
      estimatedHoursToMaster: 8,
    },
    {
      name: 'Kafka Event Streaming Architecture',
      category: 'devops' as const,
      importance: 'high' as const,
      estimatedHoursToMaster: 10,
    },
    {
      name: 'Redis Cache Invalidation & Cluster Sharding',
      category: 'databases' as const,
      importance: 'medium' as const,
      estimatedHoursToMaster: 6,
    },
  ];

  const weakSkills = skillGraph.skills
    .filter((s) => s.currentLevel < s.targetLevel)
    .map((s) => ({
      name: s.name,
      currentLevel: s.currentLevel,
      targetLevel: s.targetLevel,
      suggestedPractice: `Complete 3 targeted mock interview questions on ${s.name}.`,
    }));

  const overallReadinessPercentage = Math.min(
    95,
    Math.max(50, skillGraph.overallScore - missingSkills.length * 3)
  );

  return {
    missingSkills,
    weakSkills,
    overallReadinessPercentage,
  };
}
