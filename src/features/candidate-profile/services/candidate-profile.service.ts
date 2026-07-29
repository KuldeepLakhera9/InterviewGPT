import type { CandidateProfileData } from '../types/candidate-profile.types';
import {
  careerGoalsInfoSchema,
  educationInfoSchema,
  experienceInfoSchema,
  personalInfoSchema,
  professionalInfoSchema,
  projectsInfoSchema,
  certificationsInfoSchema,
  skillsInfoSchema,
} from '../schemas/candidate-profile.schema';

export function getDefaultCandidateProfileData(): CandidateProfileData {
  return {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      avatarUrl: '',
      headline: '',
      bio: '',
      portfolioUrl: '',
      githubUrl: '',
      linkedinUrl: '',
    },
    professionalInfo: {
      currentRole: '',
      currentCompany: '',
      yearsOfExperience: 0,
      industry: '',
      workAuthorization: '',
      noticePeriod: '',
      preferredWorkModel: 'hybrid',
    },
    skillsInfo: {
      skills: [],
    },
    educationInfo: {
      educationList: [],
    },
    experienceInfo: {
      experienceList: [],
    },
    projectsInfo: {
      projectList: [],
    },
    certificationsInfo: {
      certificationList: [],
    },
    careerGoalsInfo: {
      targetRole: '',
      targetIndustry: '',
      desiredSalaryRange: '',
      preferredCompanySize: '',
      targetLocations: [],
      shortTermGoal: '',
      longTermGoal: '',
    },
  };
}

export function calculateProfileCompletion(data?: Partial<CandidateProfileData> | null): number {
  if (!data) return 0;

  let totalScore = 0;

  // 1. Personal Info (Max 15%)
  const p = data.personalInfo;
  if (p) {
    let personalScore = 0;
    if (p.fullName && p.fullName.trim().length > 1) personalScore += 4;
    if (p.email && p.email.trim().length > 3) personalScore += 3;
    if (p.phone && p.phone.trim().length > 2) personalScore += 2;
    if (p.location && p.location.trim().length > 1) personalScore += 2;
    if (p.headline && p.headline.trim().length > 2) personalScore += 2;
    if (p.bio && p.bio.trim().length > 5) personalScore += 2;
    totalScore += Math.min(personalScore, 15);
  }

  // 2. Professional Info (Max 15%)
  const prof = data.professionalInfo;
  if (prof) {
    let profScore = 0;
    if (prof.currentRole && prof.currentRole.trim().length > 1) profScore += 5;
    if (prof.industry && prof.industry.trim().length > 1) profScore += 4;
    if (prof.workAuthorization && prof.workAuthorization.trim().length > 1) profScore += 3;
    if (prof.yearsOfExperience && prof.yearsOfExperience > 0) profScore += 3;
    totalScore += Math.min(profScore, 15);
  }

  // 3. Skills (Max 15%)
  const sk = data.skillsInfo;
  if (sk && sk.skills && sk.skills.length > 0) {
    const skillCount = sk.skills.length;
    if (skillCount >= 5) totalScore += 15;
    else if (skillCount >= 3) totalScore += 10;
    else if (skillCount >= 1) totalScore += 5;
  }

  // 4. Education (Max 15%)
  const edu = data.educationInfo;
  if (edu && edu.educationList && edu.educationList.length > 0) {
    totalScore += 15;
  }

  // 5. Experience (Max 15%)
  const exp = data.experienceInfo;
  if (exp && exp.experienceList && exp.experienceList.length > 0) {
    totalScore += 15;
  }

  // 6. Projects (Max 10%)
  const proj = data.projectsInfo;
  if (proj && proj.projectList && proj.projectList.length > 0) {
    totalScore += 10;
  }

  // 7. Certifications (Max 5%)
  const cert = data.certificationsInfo;
  if (cert && cert.certificationList && cert.certificationList.length > 0) {
    totalScore += 5;
  }

  // 8. Career Goals (Max 10%)
  const cg = data.careerGoalsInfo;
  if (cg) {
    let cgScore = 0;
    if (cg.targetRole && cg.targetRole.trim().length > 1) cgScore += 4;
    if (cg.targetIndustry && cg.targetIndustry.trim().length > 1) cgScore += 3;
    if (cg.targetLocations && cg.targetLocations.length > 0) cgScore += 3;
    totalScore += Math.min(cgScore, 10);
  }

  return Math.min(Math.max(totalScore, 0), 100);
}

export function validateStepData(
  stepNumber: number,
  data: unknown
): { isValid: boolean; error?: string } {
  try {
    switch (stepNumber) {
      case 1:
        personalInfoSchema.parse(data);
        break;
      case 2:
        professionalInfoSchema.parse(data);
        break;
      case 3:
        skillsInfoSchema.parse(data);
        break;
      case 4:
        educationInfoSchema.parse(data);
        break;
      case 5:
        experienceInfoSchema.parse(data);
        break;
      case 6:
        projectsInfoSchema.parse(data);
        break;
      case 7:
        certificationsInfoSchema.parse(data);
        break;
      case 8:
        careerGoalsInfoSchema.parse(data);
        break;
      case 9:
        // Review step: validates everything
        personalInfoSchema.parse((data as CandidateProfileData)?.personalInfo);
        professionalInfoSchema.parse((data as CandidateProfileData)?.professionalInfo);
        break;
      default:
        return { isValid: false, error: 'Invalid step number' };
    }
    return { isValid: true };
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'issues' in err) {
      const issues = (err as { issues: Array<{ message: string }> }).issues;
      return { isValid: false, error: issues[0]?.message || 'Validation error' };
    }
    return { isValid: false, error: 'Validation failed' };
  }
}
