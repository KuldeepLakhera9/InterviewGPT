import { describe, expect, it } from 'vitest';
import { buildResumeOptimiserPrompt } from '../optimiser/prompts/optimiser.prompt';
import { generateFallbackOptimisation } from '../optimiser/pipeline/optimiser-llm.provider';

describe('Resume Optimiser - Separate Prompt Template', () => {
  it('should construct prompt with candidate JSON and text', () => {
    const mockJson = { summary: 'Dev with 3 yrs exp', skills: ['React'] };
    const mockText = 'Dev with 3 yrs exp React developer';

    const prompt = buildResumeOptimiserPrompt(mockJson, mockText);

    expect(prompt).toContain('INPUT RESUME STRUCTURED JSON');
    expect(prompt).toContain('optimisedSummary');
    expect(prompt).toContain('optimisedBullets');
    expect(prompt).toContain('strongerActionVerbs');
    expect(prompt).toContain('measurableImpactItems');
  });
});

describe('Resume Optimiser - Optimisation Pipeline', () => {
  it('should generate enhanced summaries and rewritten bullets with action verbs', () => {
    const mockStructuredData = {
      personalInfo: { fullName: 'Bob Dev', email: 'bob@example.com' },
      summary: 'Frontend dev working on React apps.',
      skills: ['React', 'TypeScript', 'Next.js'],
    };
    const cleanedText = 'Bob Dev Frontend dev working on React apps';

    const result = generateFallbackOptimisation(mockStructuredData, cleanedText);

    // Verify summary enhancement
    expect(result.originalSummary).toBe('Frontend dev working on React apps.');
    expect(result.optimisedSummary).not.toBe(result.originalSummary);
    expect(result.optimisedSummary.length).toBeGreaterThan(result.originalSummary.length);

    // Verify rewritten bullets
    expect(result.optimisedBullets.length).toBeGreaterThan(0);
    expect(result.optimisedBullets[0]).toHaveProperty('actionVerb');
    expect(result.optimisedBullets[0]).toHaveProperty('rewritten');
    expect(result.optimisedBullets[0].rewritten).not.toBe(result.optimisedBullets[0].original);

    // Verify stronger action verbs suggestions
    expect(result.strongerActionVerbs.length).toBeGreaterThan(0);
    expect(result.strongerActionVerbs[0].suggestedVerbs.length).toBeGreaterThan(0);

    // Verify measurable impact metrics
    expect(result.measurableImpactItems.length).toBeGreaterThan(0);

    // Verify full export text content
    expect(result.optimisedTextContent).toContain('BOB DEV');
    expect(result.optimisedTextContent).toContain('EXECUTIVE SUMMARY');
  });
});
