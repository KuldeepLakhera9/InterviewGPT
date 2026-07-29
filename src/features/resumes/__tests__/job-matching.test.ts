import { describe, expect, it } from 'vitest';
import { buildJobMatchingPrompt } from '../job-matching/prompts/job-matching.prompt';
import { generateFallbackJobMatch } from '../job-matching/pipeline/job-matching-llm.provider';

describe('Job Matching - Separate Prompt Template', () => {
  it('should construct prompt with resume JSON, text, and target job description', () => {
    const mockJson = { summary: 'Full Stack Engineer', skills: ['TypeScript', 'React'] };
    const mockText = 'Full Stack Engineer with React experience';
    const mockJd = 'Looking for Senior Developer with Docker and Kubernetes experience.';

    const prompt = buildJobMatchingPrompt(mockJson, mockText, mockJd);

    expect(prompt).toContain('CANDIDATE RESUME STRUCTURED JSON');
    expect(prompt).toContain('TARGET JOB DESCRIPTION');
    expect(prompt).toContain('overallMatchPercentage');
    expect(prompt).toContain('missingSkills');
    expect(prompt).toContain('keywordGaps');
    expect(prompt).toContain('recommendedImprovements');
    expect(prompt).toContain('recommendedLearningResources');
  });
});

describe('Job Matching - Matching Pipeline', () => {
  it('should evaluate match percentage, identify missing skills & keyword gaps, and return learning resources', () => {
    const mockStructuredData = {
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    };
    const cleanedText = 'Full Stack Developer with TypeScript React Node.js PostgreSQL';
    const mockJd =
      'We are hiring a Senior Software Engineer with Docker, Kubernetes, AWS, and TypeScript experience.';

    const result = generateFallbackJobMatch(mockStructuredData, cleanedText, mockJd);

    // Verify Match Percentage
    expect(result.overallMatchPercentage).toBeGreaterThanOrEqual(0);
    expect(result.overallMatchPercentage).toBeLessThanOrEqual(100);

    // Verify Missing Skills & Keyword Gaps
    expect(result.missingSkills.length).toBeGreaterThan(0);
    expect(result.keywordGaps.length).toBeGreaterThan(0);
    expect(result.keywordGaps[0]).toHaveProperty('keyword');
    expect(result.keywordGaps[0]).toHaveProperty('significance');

    // Verify Recommended Improvements
    expect(result.recommendedImprovements.length).toBeGreaterThan(0);
    expect(result.recommendedImprovements[0]).toHaveProperty('area');
    expect(result.recommendedImprovements[0]).toHaveProperty('impact');

    // Verify Recommended Learning Resources
    expect(result.recommendedLearningResources.length).toBeGreaterThan(0);
    expect(result.recommendedLearningResources[0]).toHaveProperty('title');
    expect(result.recommendedLearningResources[0]).toHaveProperty('link');

    // Verify NO interview questions exist in the object structure
    expect((result as unknown as Record<string, unknown>).interviewQuestions).toBeUndefined();
  });
});
