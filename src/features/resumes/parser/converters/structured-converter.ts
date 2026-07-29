export interface ParsedPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
}

export interface ParsedWorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrentRole: boolean;
  description: string;
}

export interface ParsedEducation {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
}

export interface ParsedProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
}

export interface ParsedCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
}

export interface ParsedResumeStructure {
  personalInfo: ParsedPersonalInfo;
  summary: string;
  skills: string[];
  workExperience: ParsedWorkExperience[];
  education: ParsedEducation[];
  projects: ParsedProject[];
  certifications: ParsedCertification[];
}

export function convertToStructuredJson(cleanedText: string): ParsedResumeStructure {
  const lines = cleanedText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const personalInfo = extractPersonalInfo(lines, cleanedText);
  const summary = extractSummary(cleanedText);
  const skills = extractSkills(cleanedText);
  const workExperience = extractWorkExperience(cleanedText);
  const education = extractEducation(cleanedText);
  const projects = extractProjects(cleanedText);
  const certifications = extractCertifications(cleanedText);

  return {
    personalInfo,
    summary,
    skills,
    workExperience,
    education,
    projects,
    certifications,
  };
}

function extractPersonalInfo(lines: string[], text: string): ParsedPersonalInfo {
  // 1. Email Regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // 2. Phone Regex
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 3. URLs
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const websiteMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9_-]+\.(?:dev|io|com|org|net)/i
  );

  // 4. Candidate Name Heuristic: Usually first non-empty line that isn't an email or URL
  let fullName = '';
  for (const line of lines.slice(0, 5)) {
    if (
      line.length > 2 &&
      line.length < 50 &&
      !line.includes('@') &&
      !line.toLowerCase().includes('http') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum')
    ) {
      fullName = line;
      break;
    }
  }

  // 5. Location heuristic
  const locationMatch = text.match(
    /(?:San Francisco|New York|London|Seattle|Austin|Boston|Chicago|San Jose|Los Angeles|Remote|Toronto|Berlin|Bangalore|Singapore)[, \tA-Za-z]*/i
  );
  const location = locationMatch ? locationMatch[0].trim() : '';

  return {
    fullName: fullName || 'Candidate Name',
    email,
    phone,
    location,
    linkedinUrl: linkedinMatch ? linkedinMatch[0] : '',
    githubUrl: githubMatch ? githubMatch[0] : '',
    websiteUrl: websiteMatch ? websiteMatch[0] : '',
  };
}

function extractSummary(text: string): string {
  const summaryRegex =
    /(?:SUMMARY|OBJECTIVE|PROFILE|ABOUT ME)\s*\n+([\s\S]*?)(?=\n+[A-Z\s]{4,}|\n*$)/i;
  const match = text.match(summaryRegex);
  if (match && match[1]) {
    return match[1].trim().slice(0, 500);
  }
  return '';
}

function extractSkills(text: string): string[] {
  const skillKeywords = [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'Python',
    'Django',
    'FastAPI',
    'Java',
    'Spring Boot',
    'C++',
    'Go',
    'Golang',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'GraphQL',
    'REST API',
    'Docker',
    'Kubernetes',
    'AWS',
    'GCP',
    'Azure',
    'Git',
    'CI/CD',
    'TailwindCSS',
    'HTML',
    'CSS',
    'Redux',
    'Zustand',
    'Prisma',
    'System Design',
    'Agile',
    'Scrum',
    'Linux',
    'Microservices',
  ];

  const matchedSkills: string[] = [];
  const textLower = text.toLowerCase();

  for (const skill of skillKeywords) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(textLower)) {
      matchedSkills.push(skill);
    }
  }

  // Also check SKILLS section block if available
  const sectionRegex =
    /(?:SKILLS|TECHNICAL SKILLS|COMPETENCIES)\s*\n+([\s\S]*?)(?=\n+[A-Z\s]{4,}|\n*$)/i;
  const sectionMatch = text.match(sectionRegex);
  if (sectionMatch && sectionMatch[1]) {
    const customItems = sectionMatch[1]
      .split(/[,•\n\-]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 30 && !s.toLowerCase().includes('skills'));

    for (const item of customItems) {
      if (!matchedSkills.includes(item)) {
        matchedSkills.push(item);
      }
    }
  }

  return Array.from(new Set(matchedSkills));
}

function extractWorkExperience(text: string): ParsedWorkExperience[] {
  const expSectionRegex =
    /(?:WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY)\s*\n+([\s\S]*?)(?=\n+[A-Z\s]{4,}|\n*$)/i;
  const match = text.match(expSectionRegex);
  const sectionContent = match ? match[1] : text;

  const experiences: ParsedWorkExperience[] = [];
  const blocks = sectionContent.split(/\n(?=[A-Z][a-zA-Z0-9\s]{2,40}\s*[-–|]\s*)/);

  for (let i = 0; i < Math.min(blocks.length, 5); i++) {
    const block = blocks[i].trim();
    if (!block || block.length < 15) continue;

    const firstLine = block.split('\n')[0] || '';
    const dateMatch = block.match(
      /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})\s*(?:\d{4})?\s*[-–to]\s*(?:Present|Current|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})/i
    );

    let jobTitle = 'Software Engineer';
    let company = 'Tech Company';

    if (firstLine.includes('-') || firstLine.includes('|')) {
      const parts = firstLine.split(/[-|]/);
      jobTitle = parts[0].trim();
      company = parts[1] ? parts[1].trim() : 'Company';
    } else {
      jobTitle = firstLine.slice(0, 40);
    }

    experiences.push({
      id: `parsed_exp_${i + 1}`,
      jobTitle,
      company,
      startDate: dateMatch ? dateMatch[0].split(/[-–to]/)[0]?.trim() : '2021',
      endDate: dateMatch && dateMatch[0].toLowerCase().includes('present') ? 'Present' : '2023',
      isCurrentRole: dateMatch ? dateMatch[0].toLowerCase().includes('present') : false,
      description: block.slice(0, 300),
    });
  }

  return experiences;
}

function extractEducation(text: string): ParsedEducation[] {
  const eduSectionRegex =
    /(?:EDUCATION|ACADEMIC BACKGROUND)\s*\n+([\s\S]*?)(?=\n+[A-Z\s]{4,}|\n*$)/i;
  const match = text.match(eduSectionRegex);
  const content = match ? match[1] : text;

  const educationList: ParsedEducation[] = [];
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.toLowerCase().includes('bachelor') ||
      line.toLowerCase().includes('master') ||
      line.toLowerCase().includes('b.s') ||
      line.toLowerCase().includes('m.s') ||
      line.toLowerCase().includes('university') ||
      line.toLowerCase().includes('degree')
    ) {
      educationList.push({
        id: `parsed_edu_${educationList.length + 1}`,
        degree: line.slice(0, 50),
        institution: lines[i + 1] ? lines[i + 1].slice(0, 50) : 'University',
        startDate: '2017',
        endDate: '2021',
      });
      if (educationList.length >= 3) break;
    }
  }

  return educationList;
}

function extractProjects(text: string): ParsedProject[] {
  const projSectionRegex =
    /(?:PROJECTS|FEATURED PROJECTS|PORTFOLIO)\s*\n+([\s\S]*?)(?=\n+[A-Z\s]{4,}|\n*$)/i;
  const match = text.match(projSectionRegex);
  if (!match) return [];

  const projects: ParsedProject[] = [];
  const lines = match[1].split('\n').filter((l) => l.trim().length > 3);

  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    projects.push({
      id: `parsed_proj_${i + 1}`,
      title: lines[i].slice(0, 40),
      description: lines[i + 1] ? lines[i + 1].slice(0, 150) : lines[i].slice(0, 150),
      techStack: ['TypeScript', 'React', 'Node.js'],
    });
  }

  return projects;
}

function extractCertifications(text: string): ParsedCertification[] {
  const certSectionRegex =
    /(?:CERTIFICATIONS|LICENSES|ACCREDITATIONS)\s*\n+([\s\S]*?)(?=\n+[A-Z\s]{4,}|\n*$)/i;
  const match = text.match(certSectionRegex);
  if (!match) return [];

  const certs: ParsedCertification[] = [];
  const lines = match[1].split('\n').filter((l) => l.trim().length > 3);

  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    certs.push({
      id: `parsed_cert_${i + 1}`,
      name: lines[i].slice(0, 50),
      issuer: 'Issuing Organization',
    });
  }

  return certs;
}
