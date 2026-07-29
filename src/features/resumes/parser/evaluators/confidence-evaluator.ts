import type { ParsedResumeStructure } from '../converters/structured-converter';

export interface FieldConfidenceScores {
  fullName: number;
  email: number;
  phone: number;
  location: number;
  skills: number;
  workExperience: number;
  education: number;
  projects: number;
}

export interface ResumeConfidenceResult {
  scores: FieldConfidenceScores;
  overallConfidence: number; // Percentage 0 to 100
}

export function evaluateExtractionConfidence(
  structured: ParsedResumeStructure,
  rawTextLength: number
): ResumeConfidenceResult {
  const scores: FieldConfidenceScores = {
    fullName: 0,
    email: 0,
    phone: 0,
    location: 0,
    skills: 0,
    workExperience: 0,
    education: 0,
    projects: 0,
  };

  // 1. Full Name Confidence
  const p = structured.personalInfo;
  if (p.fullName && p.fullName !== 'Candidate Name' && p.fullName.trim().length > 2) {
    scores.fullName = 0.95;
  } else if (p.fullName) {
    scores.fullName = 0.5;
  }

  // 2. Email Confidence
  if (p.email && p.email.includes('@') && p.email.includes('.')) {
    scores.email = 0.98;
  }

  // 3. Phone Confidence
  if (p.phone && p.phone.trim().length >= 7) {
    scores.phone = 0.95;
  }

  // 4. Location Confidence
  if (p.location && p.location.trim().length > 2) {
    scores.location = 0.85;
  }

  // 5. Skills Confidence
  const skillCount = structured.skills ? structured.skills.length : 0;
  if (skillCount >= 5) {
    scores.skills = 0.95;
  } else if (skillCount >= 2) {
    scores.skills = 0.8;
  } else if (skillCount === 1) {
    scores.skills = 0.6;
  }

  // 6. Experience Confidence
  const expCount = structured.workExperience ? structured.workExperience.length : 0;
  if (expCount >= 2) {
    scores.workExperience = 0.92;
  } else if (expCount === 1) {
    scores.workExperience = 0.85;
  }

  // 7. Education Confidence
  const eduCount = structured.education ? structured.education.length : 0;
  if (eduCount >= 1) {
    scores.education = 0.9;
  }

  // 8. Projects Confidence
  const projCount = structured.projects ? structured.projects.length : 0;
  if (projCount >= 1) {
    scores.projects = 0.85;
  }

  // Calculate overall weighted score percentage
  let weightedSum = 0;
  weightedSum += scores.fullName * 0.15;
  weightedSum += scores.email * 0.2;
  weightedSum += scores.phone * 0.1;
  weightedSum += scores.skills * 0.2;
  weightedSum += scores.workExperience * 0.2;
  weightedSum += scores.education * 0.15;

  if (rawTextLength < 50) {
    weightedSum *= 0.5;
  }

  const overallConfidence = Math.min(Math.max(Math.round(weightedSum * 100), 0), 100);

  return {
    scores,
    overallConfidence,
  };
}
