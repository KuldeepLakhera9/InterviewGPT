import { z } from 'zod';

export const step1RoleSchema = z.object({
  roleTitle: z
    .string()
    .min(2, 'Role title must be at least 2 characters.')
    .max(100, 'Role title must not exceed 100 characters.'),
  seniorityLevel: z.enum(['junior', 'mid', 'senior', 'staff'], {
    required_error: 'Please select a seniority level.',
  }),
});

export const step2CompanySchema = z.object({
  companyTier: z.enum(['faang', 'startup', 'enterprise', 'fintech', 'early_stage'], {
    required_error: 'Please select a target company tier.',
  }),
  companyName: z.string().max(100, 'Company name must not exceed 100 characters.'),
});

export const step3TypeSchema = z.object({
  track: z.enum(['technical', 'system_design', 'behavioral', 'full_loop'], {
    required_error: 'Please select an interview track.',
  }),
  focusAreas: z.array(z.string()).min(1, 'Please select at least one focus area.'),
});

export const step4DifficultySchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert'], {
    required_error: 'Please select a difficulty level.',
  }),
  adaptiveDifficulty: z.boolean(),
});

export const step5DurationSchema = z.object({
  durationMinutes: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)], {
    required_error: 'Please select an interview duration.',
  }),
});

export const interviewConfigSchema = z.object({
  roleTitle: z
    .string()
    .min(2, 'Role title must be at least 2 characters.')
    .max(100, 'Role title must not exceed 100 characters.'),
  seniorityLevel: z.enum(['junior', 'mid', 'senior', 'staff']),
  companyName: z.string().max(100),
  companyTier: z.enum(['faang', 'startup', 'enterprise', 'fintech', 'early_stage']),
  track: z.enum(['technical', 'system_design', 'behavioral', 'full_loop']),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  durationMinutes: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)]),
  focusAreas: z.array(z.string()).min(1, 'Please select at least one focus area.'),
  adaptiveDifficulty: z.boolean(),
});

export function validateInterviewStep(
  stepNumber: number,
  data: unknown
): { isValid: boolean; error?: string } {
  try {
    switch (stepNumber) {
      case 1: {
        const res = step1RoleSchema.safeParse(data);
        if (!res.success) {
          return {
            isValid: false,
            error: res.error.issues[0]?.message || 'Invalid Role selection.',
          };
        }
        return { isValid: true };
      }
      case 2: {
        const res = step2CompanySchema.safeParse(data);
        if (!res.success) {
          return {
            isValid: false,
            error: res.error.issues[0]?.message || 'Invalid Company selection.',
          };
        }
        return { isValid: true };
      }
      case 3: {
        const res = step3TypeSchema.safeParse(data);
        if (!res.success) {
          return {
            isValid: false,
            error: res.error.issues[0]?.message || 'Invalid Track selection.',
          };
        }
        return { isValid: true };
      }
      case 4: {
        const res = step4DifficultySchema.safeParse(data);
        if (!res.success) {
          return {
            isValid: false,
            error: res.error.issues[0]?.message || 'Invalid Difficulty selection.',
          };
        }
        return { isValid: true };
      }
      case 5: {
        const res = step5DurationSchema.safeParse(data);
        if (!res.success) {
          return {
            isValid: false,
            error: res.error.issues[0]?.message || 'Invalid Duration selection.',
          };
        }
        return { isValid: true };
      }
      case 6: {
        const res = interviewConfigSchema.safeParse(data);
        if (!res.success) {
          return {
            isValid: false,
            error: res.error.issues[0]?.message || 'Full configuration incomplete.',
          };
        }
        return { isValid: true };
      }
      default:
        return { isValid: false, error: 'Unknown step number.' };
    }
  } catch (err) {
    return { isValid: false, error: (err as Error).message || 'Validation error occurred.' };
  }
}
