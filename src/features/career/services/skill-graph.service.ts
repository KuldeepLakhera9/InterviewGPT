import { prisma } from '@/lib/prisma';
import type { SkillGraphData, SkillItem } from '../types/career.types';

export function getDefaultSkillGraph(): SkillGraphData {
  const skills: SkillItem[] = [
    {
      name: 'TypeScript',
      category: 'programming_languages',
      currentLevel: 88,
      targetLevel: 95,
      confidenceScore: 90,
      evidenceSources: ['Resume Parsing', 'Mock Interview #1'],
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'React & Next.js 15',
      category: 'frameworks',
      currentLevel: 85,
      targetLevel: 95,
      confidenceScore: 88,
      evidenceSources: ['Resume Parsing', 'Coding Challenge'],
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Node.js & Express',
      category: 'frameworks',
      currentLevel: 82,
      targetLevel: 90,
      confidenceScore: 85,
      evidenceSources: ['Resume Parsing'],
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'PostgreSQL & Prisma',
      category: 'databases',
      currentLevel: 78,
      targetLevel: 88,
      confidenceScore: 80,
      evidenceSources: ['Resume Parsing', 'Evaluation Report'],
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'System Design Architecture',
      category: 'system_design',
      currentLevel: 72,
      targetLevel: 90,
      confidenceScore: 75,
      evidenceSources: ['Mock Interview #2'],
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Data Structures & Algorithms',
      category: 'dsa',
      currentLevel: 75,
      targetLevel: 90,
      confidenceScore: 78,
      evidenceSources: ['Coding Practice'],
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'Docker & Kubernetes',
      category: 'devops',
      currentLevel: 65,
      targetLevel: 82,
      confidenceScore: 70,
      evidenceSources: ['Resume Parsing'],
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'AWS / GCP Cloud Architecture',
      category: 'cloud',
      currentLevel: 70,
      targetLevel: 85,
      confidenceScore: 74,
      evidenceSources: ['Resume Parsing'],
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'STAR Storytelling Communication',
      category: 'communication',
      currentLevel: 84,
      targetLevel: 92,
      confidenceScore: 86,
      evidenceSources: ['Evaluation Report #1'],
      lastUpdated: new Date().toISOString(),
    },
  ];

  const overallScore = Math.round(
    skills.reduce((acc, s) => acc + s.currentLevel, 0) / skills.length
  );

  return {
    id: 'sg-default-1',
    overallScore,
    skills,
    lastUpdated: new Date().toISOString(),
  };
}

export async function getCandidateSkillGraph(userId: string): Promise<SkillGraphData> {
  try {
    const record = await prisma.candidateSkillGraph.findUnique({
      where: { userId },
    });

    if (record) {
      const skills = (record.skillsData as unknown as SkillItem[]) || [];
      return {
        id: record.id,
        overallScore: record.overallScore,
        skills,
        lastUpdated: record.lastUpdated.toISOString(),
      };
    }

    return getDefaultSkillGraph();
  } catch (err) {
    console.warn('DB getCandidateSkillGraph failed, returning fallback graph:', err);
    return getDefaultSkillGraph();
  }
}
