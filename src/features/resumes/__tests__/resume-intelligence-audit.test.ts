import { describe, expect, it } from 'vitest';
import { ResumeCache } from '../utils/resume-cache';
import { formatErrorMessage, ResumeError } from '../utils/resume-errors';
import { validateResumeFile } from '../utils/resume-validator';
import { ATS_SYSTEM_PROMPT } from '../ats/prompts/ats-analysis.prompt';
import { OPTIMISER_SYSTEM_PROMPT } from '../optimiser/prompts/optimiser.prompt';
import { JOB_MATCHING_SYSTEM_PROMPT } from '../job-matching/prompts/job-matching.prompt';
import { ASSISTANT_SYSTEM_PROMPT } from '../assistant/prompts/assistant.prompt';

describe('Resume Intelligence Audit - Caching Layer', () => {
  it('should set, get, and expire items correctly in ResumeCache', async () => {
    const cache = new ResumeCache();
    cache.set('testKey', { atsScore: 85 }, 100);

    const hit = cache.get<{ atsScore: number }>('testKey');
    expect(hit).not.toBeNull();
    expect(hit?.atsScore).toBe(85);

    // Wait for TTL expiration
    await new Promise((resolve) => setTimeout(resolve, 150));
    const expiredHit = cache.get<{ atsScore: number }>('testKey');
    expect(expiredHit).toBeNull();
  });
});

describe('Resume Intelligence Audit - Standardized Error Codes', () => {
  it('should construct ResumeError with explicit codes', () => {
    const err = new ResumeError('Magic byte mismatch', 'INVALID_FILE_HEADER', 400);
    expect(err.code).toBe('INVALID_FILE_HEADER');
    expect(err.statusCode).toBe(400);

    const formatted = formatErrorMessage(err);
    expect(formatted).toBe('[INVALID_FILE_HEADER] Magic byte mismatch');
  });
});

describe('Resume Intelligence Audit - Prompt Architecture Isolation', () => {
  it('should maintain strict JSON and RAG isolation without leaking interview questions', () => {
    expect(ATS_SYSTEM_PROMPT).toContain('JSON');
    expect(OPTIMISER_SYSTEM_PROMPT).toContain('power action verbs');
    expect(JOB_MATCHING_SYSTEM_PROMPT).toContain('Do NOT generate interview questions');
    expect(ASSISTANT_SYSTEM_PROMPT).toContain('Do NOT perform mock interviews');
  });
});

describe('Resume Intelligence Audit - Security & Magic Byte Validation', () => {
  it('should reject spoofed text files claiming to be PDF', () => {
    const fakePdfBuffer = Buffer.from('PLAIN TEXT SPOOF FILE');
    const result = validateResumeFile(fakePdfBuffer, 'resume.pdf', 'application/pdf');

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('does not match a valid PDF header');
  });
});
