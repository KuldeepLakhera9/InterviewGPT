import { describe, expect, it } from 'vitest';
import {
  calculateProfileCompletion,
  getDefaultCandidateProfileData,
  validateStepData,
} from '../services/candidate-profile.service';
import { personalInfoSchema, professionalInfoSchema } from '../schemas/candidate-profile.schema';

describe('Candidate Profile Service', () => {
  it('should return 0 completion for default empty profile data', () => {
    const defaultData = getDefaultCandidateProfileData();
    const completion = calculateProfileCompletion(defaultData);
    expect(completion).toBe(0);
  });

  it('should calculate partial completion when personal & professional info are filled', () => {
    const data = getDefaultCandidateProfileData();
    data.personalInfo.fullName = 'Alex Chen';
    data.personalInfo.email = 'alex@example.com';
    data.personalInfo.headline = 'Senior Software Engineer';
    data.personalInfo.bio = 'Experienced full-stack engineer.';
    data.personalInfo.location = 'San Francisco, CA';

    data.professionalInfo.currentRole = 'Senior Frontend Engineer';
    data.professionalInfo.industry = 'Software Development';
    data.professionalInfo.workAuthorization = 'US Citizen';
    data.professionalInfo.yearsOfExperience = 5;

    const completion = calculateProfileCompletion(data);
    expect(completion).toBeGreaterThanOrEqual(25);
  });

  it('should calculate 100% completion when all candidate profile sections are filled', () => {
    const data = getDefaultCandidateProfileData();
    data.personalInfo = {
      fullName: 'Alex Chen',
      email: 'alex@example.com',
      phone: '+1 555-0199',
      location: 'San Francisco, CA',
      headline: 'Senior Full Stack Engineer',
      bio: 'Building AI tools and cloud applications',
    };

    data.professionalInfo = {
      currentRole: 'Senior Staff Engineer',
      industry: 'Artificial Intelligence',
      workAuthorization: 'Authorized',
      yearsOfExperience: 8,
      preferredWorkModel: 'hybrid',
    };

    data.skillsInfo.skills = [
      { id: '1', name: 'TypeScript', category: 'primary', proficiency: 'expert' },
      { id: '2', name: 'React', category: 'primary', proficiency: 'expert' },
      { id: '3', name: 'Node.js', category: 'primary', proficiency: 'advanced' },
      { id: '4', name: 'Next.js', category: 'secondary', proficiency: 'advanced' },
      { id: '5', name: 'PostgreSQL', category: 'tool', proficiency: 'intermediate' },
    ];

    data.educationInfo.educationList = [
      {
        id: 'edu_1',
        degree: 'B.S. Computer Science',
        fieldOfStudy: 'Computer Science',
        institution: 'Stanford University',
        startDate: '2016',
        endDate: '2020',
        isCurrentlyStudying: false,
      },
    ];

    data.experienceInfo.experienceList = [
      {
        id: 'exp_1',
        jobTitle: 'Senior Software Engineer',
        company: 'Acme Corp',
        startDate: '2020',
        isCurrentRole: true,
      },
    ];

    data.projectsInfo.projectList = [
      {
        id: 'proj_1',
        title: 'InterviewGPT App',
        description: 'AI Mock Interviewing System',
        techStack: ['React', 'Next.js', 'Prisma'],
      },
    ];

    data.certificationsInfo.certificationList = [
      {
        id: 'cert_1',
        name: 'AWS Certified Solutions Architect',
        issuingOrganization: 'Amazon Web Services',
        issueDate: '2022',
      },
    ];

    data.careerGoalsInfo = {
      targetRole: 'Engineering Manager',
      targetIndustry: 'SaaS / AI',
      targetLocations: ['San Francisco', 'Remote'],
    };

    const completion = calculateProfileCompletion(data);
    expect(completion).toBe(100);
  });

  it('should validate step 1 correctly', () => {
    const validResult = validateStepData(1, {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
    });
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateStepData(1, {
      fullName: 'A',
      email: 'invalid-email',
    });
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.error).toBeDefined();
  });
});

describe('Candidate Profile Zod Schemas', () => {
  it('should pass valid personalInfoSchema data', () => {
    const parsed = personalInfoSchema.safeParse({
      fullName: 'John Smith',
      email: 'john@example.com',
      portfolioUrl: 'https://johnsmith.dev',
    });
    expect(parsed.success).toBe(true);
  });

  it('should reject invalid email in personalInfoSchema', () => {
    const parsed = personalInfoSchema.safeParse({
      fullName: 'John Smith',
      email: 'not-an-email',
    });
    expect(parsed.success).toBe(false);
  });

  it('should validate professionalInfoSchema with valid inputs', () => {
    const parsed = professionalInfoSchema.safeParse({
      currentRole: 'Backend Engineer',
      yearsOfExperience: 3,
      industry: 'Fintech',
      workAuthorization: 'Citizen',
      preferredWorkModel: 'remote',
    });
    expect(parsed.success).toBe(true);
  });
});
