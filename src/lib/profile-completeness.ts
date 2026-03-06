interface ProfileData {
  nameKo?: string | null;
  phone?: string | null;
  bio?: string | null;
  desiredRole?: string | null;
  desiredIndustry?: string | null;
  portfolioUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  educations?: unknown[];
  workExperiences?: unknown[];
  skills?: unknown[];
  certifications?: unknown[];
}

interface SectionScore {
  section: string;
  completed: boolean;
  weight: number;
}

export interface CompletenessResult {
  percentage: number;
  completedSections: string[];
  missingSections: string[];
  sectionScores: SectionScore[];
}

export function calculateProfileCompleteness(
  profile: ProfileData | null
): CompletenessResult {
  const sections: SectionScore[] = [
    {
      section: "기본 정보",
      completed: !!(profile?.nameKo && profile?.phone),
      weight: 20,
    },
    {
      section: "학력",
      completed: !!(profile?.educations && profile.educations.length > 0),
      weight: 15,
    },
    {
      section: "경력",
      completed: !!(profile?.workExperiences && profile.workExperiences.length > 0),
      weight: 20,
    },
    {
      section: "스킬",
      completed: !!(profile?.skills && profile.skills.length > 0),
      weight: 15,
    },
    {
      section: "자격증",
      completed: !!(profile?.certifications && profile.certifications.length > 0),
      weight: 10,
    },
    {
      section: "희망 직무",
      completed: !!(profile?.desiredRole && profile?.desiredIndustry),
      weight: 10,
    },
    {
      section: "자기소개",
      completed: !!profile?.bio,
      weight: 5,
    },
    {
      section: "링크",
      completed: !!(profile?.portfolioUrl || profile?.linkedinUrl || profile?.githubUrl),
      weight: 5,
    },
  ];

  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const completedWeight = sections
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.weight, 0);

  return {
    percentage: Math.round((completedWeight / totalWeight) * 100),
    completedSections: sections.filter((s) => s.completed).map((s) => s.section),
    missingSections: sections.filter((s) => !s.completed).map((s) => s.section),
    sectionScores: sections,
  };
}
