export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export type WorkModel = 'remote' | 'hybrid' | 'onsite' | 'flexible';

export interface ProfessionalInfo {
  currentRole: string;
  currentCompany?: string;
  yearsOfExperience: number;
  industry: string;
  workAuthorization: string;
  noticePeriod?: string;
  preferredWorkModel: WorkModel;
}

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'primary' | 'secondary' | 'tool';

export interface SkillEntry {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
}

export interface SkillsInfo {
  skills: SkillEntry[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying?: boolean;
  grade?: string;
}

export interface EducationInfo {
  educationList: EducationEntry[];
}

export interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentRole?: boolean;
  description?: string;
}

export interface ExperienceInfo {
  experienceList: ExperienceEntry[];
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  techStack?: string[];
  repoUrl?: string;
  liveUrl?: string;
  role?: string;
}

export interface ProjectsInfo {
  projectList: ProjectEntry[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CertificationsInfo {
  certificationList: CertificationEntry[];
}

export interface CareerGoalsInfo {
  targetRole: string;
  targetIndustry: string;
  desiredSalaryRange?: string;
  preferredCompanySize?: string;
  targetLocations?: string[];
  shortTermGoal?: string;
  longTermGoal?: string;
}

export interface CandidateProfileData {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  skillsInfo: SkillsInfo;
  educationInfo: EducationInfo;
  experienceInfo: ExperienceInfo;
  projectsInfo: ProjectsInfo;
  certificationsInfo: CertificationsInfo;
  careerGoalsInfo: CareerGoalsInfo;
}

export interface StepStatus {
  stepNumber: number;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  isValid: boolean;
}

export interface CandidateProfileState {
  currentStep: number;
  completionPercentage: number;
  isSubmitted: boolean;
  data: CandidateProfileData;
  updatedAt?: string;
}

export interface SaveDraftResult {
  success: boolean;
  error?: string;
  message?: string;
  completionPercentage?: number;
}

export interface SubmitProfileResult {
  success: boolean;
  error?: string;
  message?: string;
  redirectTo?: string;
}
