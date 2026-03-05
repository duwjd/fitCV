export const SITE_NAME = "fit.CV";
export const SITE_DESCRIPTION =
  "AI 기반 커리어 관리 플랫폼 — 이력서 생성, 자기소개서 작성, 모의면접까지";

export const NAV_ITEMS = [
  { label: "대시보드", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "채용공고", href: "/jobs", icon: "Briefcase" },
  { label: "추천", href: "/recommendations", icon: "Sparkles" },
] as const;

export const DOC_ITEMS = [
  { label: "이력서", href: "/resumes", icon: "FileText" },
  { label: "자기소개서", href: "/cover-letters", icon: "PenTool" },
] as const;

export const PRACTICE_ITEMS = [
  { label: "모의면접", href: "/interviews", icon: "MessageSquare" },
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];
