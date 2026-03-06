import { z } from "zod";

export const basicInfoSchema = z.object({
  nameKo: z.string().min(2, "이름은 2자 이상이어야 합니다").max(50),
  nameEn: z.string().max(100).optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, "올바른 휴대폰 번호를 입력해주세요")
    .optional()
    .or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  address: z.string().max(200).optional().or(z.literal("")),
  bio: z.string().max(1000).optional().or(z.literal("")),
});

export const careerPreferencesSchema = z.object({
  desiredRole: z.string().max(100).optional().or(z.literal("")),
  desiredIndustry: z.string().max(100).optional().or(z.literal("")),
  experienceYears: z.coerce.number().min(0).max(50).optional(),
  educationLevel: z
    .enum(["HIGH_SCHOOL", "ASSOCIATE", "BACHELOR", "MASTER", "DOCTORATE", "OTHER"])
    .optional(),
  salaryExpectation: z.coerce.number().min(0).optional(),
  availableFrom: z.string().optional().or(z.literal("")),
});

export const linksSchema = z.object({
  portfolioUrl: z.string().url("올바른 URL을 입력해주세요").optional().or(z.literal("")),
  linkedinUrl: z.string().url("올바른 URL을 입력해주세요").optional().or(z.literal("")),
  githubUrl: z.string().url("올바른 URL을 입력해주세요").optional().or(z.literal("")),
});

export const workExperienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "회사명을 입력해주세요"),
  position: z.string().min(1, "직책을 입력해주세요"),
  startDate: z.string().min(1, "시작일을 입력해주세요"),
  endDate: z.string().optional().or(z.literal("")),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000).optional().or(z.literal("")),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "학교명을 입력해주세요"),
  degree: z
    .enum(["HIGH_SCHOOL", "ASSOCIATE", "BACHELOR", "MASTER", "DOCTORATE", "OTHER"])
    .optional(),
  major: z.string().max(100).optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  gpa: z.coerce.number().min(0).max(5).optional(),
  description: z.string().max(1000).optional().or(z.literal("")),
});

export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "자격증명을 입력해주세요"),
  issuer: z.string().min(1, "발급기관을 입력해주세요"),
  issueDate: z.string().optional().or(z.literal("")),
  expiryDate: z.string().optional().or(z.literal("")),
  credentialId: z.string().max(100).optional().or(z.literal("")),
});

export const skillSchema = z.object({
  name: z.string().min(1, "스킬명을 입력해주세요"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("INTERMEDIATE"),
});

export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
export type CareerPreferencesInput = z.infer<typeof careerPreferencesSchema>;
export type LinksInput = z.infer<typeof linksSchema>;
export type WorkExperienceInput = z.infer<typeof workExperienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
