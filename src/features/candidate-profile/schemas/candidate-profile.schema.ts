import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  avatarUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  portfolioUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  linkedinUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
});

export const professionalInfoSchema = z.object({
  currentRole: z.string().min(2, 'Current role is required'),
  currentCompany: z.string().optional(),
  yearsOfExperience: z.coerce
    .number()
    .min(0, 'Years of experience cannot be negative')
    .max(60, 'Years of experience is out of range'),
  industry: z.string().min(2, 'Industry is required'),
  workAuthorization: z.string().min(2, 'Work authorization is required'),
  noticePeriod: z.string().optional(),
  preferredWorkModel: z.enum(['remote', 'hybrid', 'onsite', 'flexible'], {
    required_error: 'Please select a preferred work model',
  }),
});

export const skillEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name cannot be empty'),
  category: z.enum(['primary', 'secondary', 'tool']),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});

export const skillsInfoSchema = z.object({
  skills: z.array(skillEntrySchema).min(1, 'Please add at least one primary skill'),
});

export const educationEntrySchema = z.object({
  id: z.string(),
  degree: z.string().min(2, 'Degree title is required'),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  institution: z.string().min(2, 'Institution name is required'),
  startDate: z.string().min(4, 'Start date/year is required'),
  endDate: z.string().optional(),
  isCurrentlyStudying: z.boolean().optional(),
  grade: z.string().optional(),
});

export const educationInfoSchema = z.object({
  educationList: z.array(educationEntrySchema),
});

export const experienceEntrySchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().optional(),
  startDate: z.string().min(4, 'Start date/year is required'),
  endDate: z.string().optional(),
  isCurrentRole: z.boolean().optional(),
  description: z.string().optional(),
});

export const experienceInfoSchema = z.object({
  experienceList: z.array(experienceEntrySchema),
});

export const projectEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(2, 'Project title is required'),
  description: z.string().min(5, 'Description should be at least 5 characters'),
  techStack: z.array(z.string()).optional(),
  repoUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  liveUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  role: z.string().optional(),
});

export const projectsInfoSchema = z.object({
  projectList: z.array(projectEntrySchema),
});

export const certificationEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Certification name is required'),
  issuingOrganization: z.string().min(2, 'Issuing organization is required'),
  issueDate: z.string().min(4, 'Issue date/year is required'),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
});

export const certificationsInfoSchema = z.object({
  certificationList: z.array(certificationEntrySchema),
});

export const careerGoalsInfoSchema = z.object({
  targetRole: z.string().min(2, 'Target role is required'),
  targetIndustry: z.string().min(2, 'Target industry is required'),
  desiredSalaryRange: z.string().optional(),
  preferredCompanySize: z.string().optional(),
  targetLocations: z.array(z.string()).optional(),
  shortTermGoal: z.string().optional(),
  longTermGoal: z.string().optional(),
});

export const candidateProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalInfo: professionalInfoSchema,
  skillsInfo: skillsInfoSchema,
  educationInfo: educationInfoSchema,
  experienceInfo: experienceInfoSchema,
  projectsInfo: projectsInfoSchema,
  certificationsInfo: certificationsInfoSchema,
  careerGoalsInfo: careerGoalsInfoSchema,
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ProfessionalInfoInput = z.infer<typeof professionalInfoSchema>;
export type SkillsInfoInput = z.infer<typeof skillsInfoSchema>;
export type EducationInfoInput = z.infer<typeof educationInfoSchema>;
export type ExperienceInfoInput = z.infer<typeof experienceInfoSchema>;
export type ProjectsInfoInput = z.infer<typeof projectsInfoSchema>;
export type CertificationsInfoInput = z.infer<typeof certificationsInfoSchema>;
export type CareerGoalsInfoInput = z.infer<typeof careerGoalsInfoSchema>;
export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;
