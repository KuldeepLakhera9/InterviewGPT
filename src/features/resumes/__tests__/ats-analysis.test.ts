import { describe, expect, it } from 'vitest';
import { buildAtsAnalysisPrompt } from '../ats/prompts/ats-analysis.prompt';
import { generateFallbackAtsAnalysis } from '../ats/pipeline/ats-llm.provider';

describe('ATS Analysis Module - Separate Prompt Template', () => {
  it('should generate a structured prompt incorporating candidate JSON and text', () => {
    const mockJson = {
      personalInfo: { fullName: 'Alice Specialist' },
      skills: ['TypeScript', 'React'],
    };
    const mockText = 'Alice Specialist React Developer';

    const prompt = buildAtsAnalysisPrompt(mockJson, mockText);

    expect(prompt).toContain('INPUT RESUME STRUCTURED JSON');
    expect(prompt).toContain('Alice Specialist');
    expect(prompt).toContain('atsScore');
    expect(prompt).toContain('recruiterScore');
    expect(prompt).toContain('missingKeywords');
    expect(prompt).toContain('formattingFeedback');
  });
});

describe('ATS Analysis Module - Evaluation Engine', () => {
  it('should generate valid ATS scores and structured feedback items', () => {
    const sampleData = {
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
      workExperience: [
        { jobTitle: 'Senior Full Stack Engineer', company: 'Tech Corp' },
        { jobTitle: 'Software Engineer', company: 'Startup Inc' },
      ],
    };
    const cleanedText =
      'Senior Full Stack Engineer React Next.js TypeScript Node.js PostgreSQL GitHub LinkedIn';

    const result = generateFallbackAtsAnalysis(sampleData, cleanedText);

    // Verify ATS Score and Recruiter Score
    expect(result.atsScore).toBeGreaterThanOrEqual(0);
    expect(result.atsScore).toBeLessThanOrEqual(100);
    expect(result.recruiterScore).toBeGreaterThanOrEqual(0);
    expect(result.recruiterScore).toBeLessThanOrEqual(100);

    // Verify required return fields
    expect(Array.isArray(result.missingKeywords)).toBe(true);
    expect(Array.isArray(result.weakSections)).toBe(true);
    expect(Array.isArray(result.strengths)).toBe(true);
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(Array.isArray(result.formattingFeedback)).toBe(true);

    // Verify weak sections structure
    if (result.weakSections.length > 0) {
      expect(result.weakSections[0]).toHaveProperty('section');
      expect(result.weakSections[0]).toHaveProperty('issue');
      expect(result.weakSections[0]).toHaveProperty('recommendation');
    }

    // Verify suggestions impact tagging
    if (result.suggestions.length > 0) {
      expect(['High', 'Medium', 'Low']).toContain(result.suggestions[0].impact);
    }

    // Verify formatting feedback statuses
    if (result.formattingFeedback.length > 0) {
      expect(['Pass', 'Warning', 'Fail']).toContain(result.formattingFeedback[0].status);
    }
  });
});
