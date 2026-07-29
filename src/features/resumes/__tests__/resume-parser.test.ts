import { describe, expect, it } from 'vitest';
import { cleanResumeText } from '../parser/cleaners/text-cleaner';
import { convertToStructuredJson } from '../parser/converters/structured-converter';
import { evaluateExtractionConfidence } from '../parser/evaluators/confidence-evaluator';
import { parseResumePipeline } from '../parser/resume-parser.pipeline';

describe('Resume Parsing Pipeline - Text Cleaner', () => {
  it('should strip control characters and normalize weird bullet points', () => {
    const rawInput =
      'John Doe\x00\x05\n• Senior Engineer\nâ€¢ Built React apps\n\n\n\n- TypeScript expert';
    const cleaned = cleanResumeText(rawInput);

    expect(cleaned).not.toContain('\x00');
    expect(cleaned).toContain('- Senior Engineer');
    expect(cleaned).toContain('- Built React apps');
    expect(cleaned).toContain('- TypeScript expert');
    expect(cleaned).not.toContain('\n\n\n\n');
  });
});

describe('Resume Parsing Pipeline - Structured Converter', () => {
  const sampleCleanText = `
    Jane Smith
    jane.smith@example.com | (555) 123-4567 | San Francisco, CA
    linkedin.com/in/janesmith | github.com/janesmith

    SUMMARY
    Senior Full Stack Engineer with 6 years of experience building scalable web applications.

    SKILLS
    JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS, GraphQL

    WORK EXPERIENCE
    Senior Software Engineer - Acme Corp
    Jan 2021 - Present
    - Architected Next.js micro-frontends serving 1M daily active users.
    - Improved page load performance by 40%.

    EDUCATION
    Bachelor of Science in Computer Science
    Stanford University
    2016 - 2020
  `;

  it('should extract personal details correctly', () => {
    const structured = convertToStructuredJson(sampleCleanText);

    expect(structured.personalInfo.fullName).toBe('Jane Smith');
    expect(structured.personalInfo.email).toBe('jane.smith@example.com');
    expect(structured.personalInfo.phone).toBe('(555) 123-4567');
    expect(structured.personalInfo.location).toBe('San Francisco, CA');
    expect(structured.personalInfo.linkedinUrl).toContain('linkedin.com/in/janesmith');
  });

  it('should extract skills correctly', () => {
    const structured = convertToStructuredJson(sampleCleanText);

    expect(structured.skills).toContain('TypeScript');
    expect(structured.skills).toContain('React');
    expect(structured.skills).toContain('Next.js');
    expect(structured.skills).toContain('Node.js');
  });

  it('should extract work experience and education', () => {
    const structured = convertToStructuredJson(sampleCleanText);

    expect(structured.workExperience.length).toBeGreaterThan(0);
    expect(structured.workExperience[0].jobTitle).toContain('Senior Software Engineer');
    expect(structured.education.length).toBeGreaterThan(0);
    expect(structured.education[0].degree).toContain('Bachelor of Science');
  });
});

describe('Resume Parsing Pipeline - Confidence Evaluator', () => {
  it('should calculate high confidence scores when all fields are present', () => {
    const sampleText = `
      John Doe
      john@example.com
      (555) 000-1111
      SKILLS: React, TypeScript, Node.js, PostgreSQL, AWS
      WORK EXPERIENCE: Senior Engineer at Acme
      EDUCATION: B.S. Computer Science
    `;
    const structured = convertToStructuredJson(sampleText);
    const confidence = evaluateExtractionConfidence(structured, sampleText.length);

    expect(confidence.scores.fullName).toBeGreaterThan(0.8);
    expect(confidence.scores.email).toBeGreaterThan(0.9);
    expect(confidence.scores.phone).toBeGreaterThan(0.9);
    expect(confidence.overallConfidence).toBeGreaterThan(70);
  });
});

describe('Resume Parsing Pipeline - End-to-End Pipeline', () => {
  it('should process a sample PDF buffer through the 5-stage pipeline', async () => {
    const fakePdfContent = Buffer.from(`
      %PDF-1.4
      [(Alex Johnson) Tj
      [(alex@example.com) Tj
      [(SKILLS: Python, Django, PostgreSQL) Tj
    `);

    const result = await parseResumePipeline(fakePdfContent, 'alex_resume.pdf', 'application/pdf');

    expect(result.rawText).toBeDefined();
    expect(result.cleanedText).toBeDefined();
    expect(result.structuredData).toBeDefined();
    expect(result.confidenceScores).toBeDefined();
    expect(result.overallConfidence).toBeGreaterThanOrEqual(0);
  });
});
