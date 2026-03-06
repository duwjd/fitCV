import { z } from "zod";

export const createResumeSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100),
  language: z.string().default("ko"),
});

export const updateResumeSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100).optional(),
  language: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const resumeVersionSchema = z.object({
  changeNote: z.string().max(200).optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
