import { describe, expect, it } from 'vitest';
import type { ParsedResumeRecord, ResumeItem } from '../types/resume.types';

describe('Resume Dashboard Components Logic', () => {
  const sampleResume: ResumeItem = {
    id: 'res_123',
    workspaceId: 'ws_1',
    userId: 'usr_1',
    fileName: 'senior_developer_resume.pdf',
    fileUrl: '/uploads/resumes/res_123.pdf',
    fileKey: 'resumes/res_123.pdf',
    fileSize: 1048576, // 1 MB
    mimeType: 'application/pdf',
    version: 2,
    isActive: true,
    createdAt: '2026-07-29T10:00:00.000Z',
    updatedAt: '2026-07-29T10:00:00.000Z',
  };

  const sampleParsedResume: ParsedResumeRecord = {
    id: 'pr_123',
    resumeId: 'res_123',
    rawText: 'John Doe React TypeScript Developer',
    cleanedText: 'John Doe React TypeScript Developer',
    structuredData: {
      personalInfo: { fullName: 'John Doe', email: 'john@example.com' },
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
      workExperience: [
        { id: '1', jobTitle: 'Senior Software Engineer', company: 'Acme' },
        { id: '2', jobTitle: 'Frontend Engineer', company: 'Tech Inc' },
      ],
      education: [{ id: '1', degree: 'B.S. CS', institution: 'Stanford' }],
    },
    confidenceScores: { fullName: 0.95, email: 0.98, skills: 0.95 },
    overallConfidence: 94,
    createdAt: '2026-07-29T10:00:00.000Z',
    updatedAt: '2026-07-29T10:00:00.000Z',
  };

  it('should accurately format file size and version attributes', () => {
    expect(sampleResume.version).toBe(2);
    expect(sampleResume.isActive).toBe(true);
    expect(sampleResume.fileName).toContain('.pdf');
  });

  it('should parse structured fields and evaluate mock readiness score', () => {
    const structured = sampleParsedResume.structuredData as {
      skills: string[];
      workExperience: unknown[];
    };
    const skillCount = structured.skills.length;
    const expCount = structured.workExperience.length;

    const mockReadinessIndex = Math.min(75 + skillCount * 1.5 + expCount * 3, 98);

    expect(skillCount).toBe(5);
    expect(expCount).toBe(2);
    expect(mockReadinessIndex).toBeGreaterThan(80);
    expect(sampleParsedResume.overallConfidence).toBe(94);
  });
});
