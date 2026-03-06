export interface ResumePersonalInfo {
  nameKo: string;
  nameEn?: string;
  photo?: string;
  birthDate?: string;
  phone: string;
  email: string;
  address?: string;
  militaryService?: string;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  major: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  maxGpa?: number;
}

export interface ResumeWorkExperience {
  company: string;
  position: string;
  department?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  achievements: string[];
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  issueDate: string;
}

export interface ResumeSkill {
  name: string;
  level?: string;
}

export interface ResumeLanguage {
  language: string;
  testName?: string;
  score?: string;
}

export interface ResumeAward {
  title: string;
  issuer: string;
  date: string;
}

export interface ResumeProject {
  name: string;
  role?: string;
  startDate: string;
  endDate?: string;
  description: string;
  techStack?: string[];
}

export interface ResumeContent {
  personalInfo: ResumePersonalInfo;
  education: ResumeEducation[];
  workExperience: ResumeWorkExperience[];
  certifications: ResumeCertification[];
  skills: ResumeSkill[];
  languages: ResumeLanguage[];
  awards: ResumeAward[];
  projects: ResumeProject[];
  summary?: string;
}
