import { describe, expect, it } from 'vitest';
import {
  interviewConfigSchema,
  step1RoleSchema,
  step2CompanySchema,
  step3TypeSchema,
  step4DifficultySchema,
  step5DurationSchema,
  validateInterviewStep,
} from '../schemas/interview-wizard.schema';
import {
  calculateConfigCompletion,
  generateResumeRecommendation,
  getDefaultInterviewConfigData,
  SYSTEM_DEFAULT_PRESETS,
} from '../services/interview-wizard.service';
import type { InterviewConfigData } from '../types/interview-wizard.types';

describe('Interview Configuration Wizard Domain Suite', () => {
  it('should generate valid default interview config data', () => {
    const defaultData = getDefaultInterviewConfigData();
    expect(defaultData.roleTitle).toBe('Full Stack Engineer');
    expect(defaultData.seniorityLevel).toBe('senior');
    expect(defaultData.companyTier).toBe('faang');
    expect(defaultData.track).toBe('technical');
    expect(defaultData.difficulty).toBe('medium');
    expect(defaultData.durationMinutes).toBe(30);
    expect(defaultData.focusAreas.length).toBeGreaterThan(0);

    const validation = interviewConfigSchema.safeParse(defaultData);
    expect(validation.success).toBe(true);
  });

  it('should validate Step 1 (Role & Seniority) correctly', () => {
    const validRole = { roleTitle: 'Senior Frontend Engineer', seniorityLevel: 'senior' };
    expect(step1RoleSchema.safeParse(validRole).success).toBe(true);
    expect(validateInterviewStep(1, validRole).isValid).toBe(true);

    const invalidRole = { roleTitle: 'A', seniorityLevel: 'invalid' };
    expect(step1RoleSchema.safeParse(invalidRole).success).toBe(false);
    expect(validateInterviewStep(1, invalidRole).isValid).toBe(false);
  });

  it('should validate Step 2 (Company & Tier) correctly', () => {
    const validCompany = { companyTier: 'faang', companyName: 'Google' };
    expect(step2CompanySchema.safeParse(validCompany).success).toBe(true);
    expect(validateInterviewStep(2, validCompany).isValid).toBe(true);

    const invalidCompany = { companyTier: 'non_existent' };
    expect(step2CompanySchema.safeParse(invalidCompany).success).toBe(false);
    expect(validateInterviewStep(2, invalidCompany).isValid).toBe(false);
  });

  it('should validate Step 3 (Track & Focus Areas) correctly', () => {
    const validTrack = { track: 'system_design', focusAreas: ['Microservices', 'PostgreSQL'] };
    expect(step3TypeSchema.safeParse(validTrack).success).toBe(true);
    expect(validateInterviewStep(3, validTrack).isValid).toBe(true);

    const emptyFocus = { track: 'technical', focusAreas: [] };
    expect(step3TypeSchema.safeParse(emptyFocus).success).toBe(false);
    expect(validateInterviewStep(3, emptyFocus).isValid).toBe(false);
  });

  it('should validate Step 4 (Difficulty) and Step 5 (Duration)', () => {
    const validDiff = { difficulty: 'hard', adaptiveDifficulty: true };
    expect(step4DifficultySchema.safeParse(validDiff).success).toBe(true);
    expect(validateInterviewStep(4, validDiff).isValid).toBe(true);

    const validDuration = { durationMinutes: 45 };
    expect(step5DurationSchema.safeParse(validDuration).success).toBe(true);
    expect(validateInterviewStep(5, validDuration).isValid).toBe(true);

    const invalidDuration = { durationMinutes: 99 };
    expect(step5DurationSchema.safeParse(invalidDuration).success).toBe(false);
    expect(validateInterviewStep(5, invalidDuration).isValid).toBe(false);
  });

  it('should calculate config completion percentage dynamically', () => {
    const fullData = getDefaultInterviewConfigData();
    expect(calculateConfigCompletion(fullData)).toBe(100);

    const emptyData: Partial<InterviewConfigData> = {};
    expect(calculateConfigCompletion(emptyData)).toBe(0);
  });

  it('should include built-in system default presets', () => {
    expect(SYSTEM_DEFAULT_PRESETS.length).toBeGreaterThanOrEqual(4);
    const faangPreset = SYSTEM_DEFAULT_PRESETS.find((p) => p.id === 'preset-faang-sys-design');
    expect(faangPreset).toBeDefined();
    expect(faangPreset?.config.track).toBe('system_design');
    expect(faangPreset?.config.durationMinutes).toBe(45);
  });

  it('should generate intelligent resume recommendations based on candidate profile', () => {
    const mockResume = {
      rawText:
        'Experienced Systems Architect with 10 years building distributed cloud services, microservices, and high-concurrency systems.',
    };
    const mockProfile = {
      fullName: 'Jane Doe',
      headline: 'Principal Systems Architect',
    };

    const rec = generateResumeRecommendation(mockResume, mockProfile);
    expect(rec.suggestedRoleTitle).toBe('Systems Architect');
    expect(rec.suggestedTrack).toBe('system_design');
    expect(rec.suggestedSeniority).toBe('staff');
    expect(rec.suggestedDifficulty).toBe('expert');
    expect(rec.matchScore).toBeGreaterThan(90);
  });
});
