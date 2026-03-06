"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";
import { parseResumeText } from "@/lib/ai/resume-parser";
import { generateOptimizedResume } from "@/lib/ai/resume-generator";
import {
  createResumeSchema,
  updateResumeSchema,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/validations/resume";
import type { ResumeContent } from "@/types/resume";

async function getAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("인증이 필요합니다");
  return session.user.id;
}

// ── List & Get ──

export async function getResumes() {
  const userId = await getAuthUserId();
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getResumeById(id: string) {
  const userId = await getAuthUserId();
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume || resume.userId !== userId) {
    return null;
  }
  return resume;
}

// ── Create ──

export async function createResume(values: Record<string, unknown>) {
  const userId = await getAuthUserId();
  const validated = createResumeSchema.safeParse(values);
  if (!validated.success) {
    return { success: false as const, error: validated.error.issues[0].message };
  }

  const resume = await prisma.resume.create({
    data: {
      userId,
      title: validated.data.title,
      language: validated.data.language,
      status: "DRAFT",
    },
  });

  revalidatePath("/resumes");
  return { success: true as const, data: resume };
}

// ── Update ──

export async function updateResume(
  id: string,
  values: Record<string, unknown>
) {
  const userId = await getAuthUserId();
  const validated = updateResumeSchema.safeParse(values);
  if (!validated.success) {
    return { success: false as const, error: validated.error.issues[0].message };
  }

  const existing = await prisma.resume.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false as const, error: "권한이 없습니다" };
  }

  await prisma.resume.update({
    where: { id },
    data: validated.data,
  });

  revalidatePath("/resumes");
  revalidatePath(`/resumes/${id}`);
  return { success: true as const };
}

// ── Delete ──

export async function deleteResume(id: string) {
  const userId = await getAuthUserId();

  const existing = await prisma.resume.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false as const, error: "권한이 없습니다" };
  }

  if (existing.originalFileKey) {
    try {
      await deleteFile(existing.originalFileKey);
    } catch {
      // file might already be deleted
    }
  }

  await prisma.resume.delete({ where: { id } });

  revalidatePath("/resumes");
  return { success: true as const };
}

// ── Set Default ──

export async function setDefaultResume(id: string) {
  const userId = await getAuthUserId();

  const existing = await prisma.resume.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false as const, error: "권한이 없습니다" };
  }

  await prisma.$transaction([
    prisma.resume.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.resume.update({
      where: { id },
      data: { isDefault: true },
    }),
  ]);

  revalidatePath("/resumes");
  return { success: true as const };
}

// ── File Upload & Parse ──

export async function uploadAndParseResume(formData: FormData) {
  const userId = await getAuthUserId();
  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string) || "새 이력서";

  if (!file) {
    return { success: false as const, error: "파일을 선택해주세요" };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { success: false as const, error: "PDF 또는 DOCX 파일만 업로드 가능합니다" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false as const, error: "파일 크기는 10MB 이하여야 합니다" };
  }

  // Create resume record
  const resume = await prisma.resume.create({
    data: {
      userId,
      title,
      status: "PARSING",
      originalFileName: file.name,
    },
  });

  try {
    // Upload to storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const { key, url } = await uploadFile(buffer, file.name, file.type, userId);

    await prisma.resume.update({
      where: { id: resume.id },
      data: { originalFileKey: key, originalFileUrl: url },
    });

    // Extract text
    let text: string;
    if (file.type === "application/pdf") {
      const { PDFParse } = await import("pdf-parse");
      const pdf = new PDFParse({ data: new Uint8Array(buffer) });
      const textResult = await pdf.getText();
      text = textResult.text;
      await pdf.destroy();
    } else {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    if (!text.trim()) {
      await prisma.resume.update({
        where: { id: resume.id },
        data: { status: "ERROR" },
      });
      return { success: false as const, error: "파일에서 텍스트를 추출할 수 없습니다" };
    }

    // AI parse
    const parsedData = await parseResumeText(text);

    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        parsedData: parsedData as never,
        status: "PARSED",
      },
    });

    // Save initial version
    await prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        version: 1,
        content: parsedData as never,
        changeNote: "초기 파싱",
      },
    });

    revalidatePath("/resumes");
    return { success: true as const, data: { id: resume.id } };
  } catch (error) {
    await prisma.resume.update({
      where: { id: resume.id },
      data: { status: "ERROR" },
    });
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "파싱에 실패했습니다",
    };
  }
}

// ── Update Parsed Data ──

export async function updateResumeContent(
  id: string,
  content: ResumeContent,
  changeNote?: string
) {
  const userId = await getAuthUserId();

  const existing = await prisma.resume.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false as const, error: "권한이 없습니다" };
  }

  // Get latest version number
  const latestVersion = await prisma.resumeVersion.findFirst({
    where: { resumeId: id },
    orderBy: { version: "desc" },
  });

  const newVersion = (latestVersion?.version ?? 0) + 1;

  await prisma.$transaction([
    prisma.resume.update({
      where: { id },
      data: { parsedData: content as never },
    }),
    prisma.resumeVersion.create({
      data: {
        resumeId: id,
        version: newVersion,
        content: content as never,
        changeNote: changeNote || `버전 ${newVersion}`,
      },
    }),
  ]);

  revalidatePath(`/resumes/${id}`);
  return { success: true as const };
}

// ── AI Generate ──

export async function generateResume(
  id: string,
  jobDescription?: string
) {
  const userId = await getAuthUserId();

  const existing = await prisma.resume.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false as const, error: "권한이 없습니다" };
  }

  if (!existing.parsedData) {
    return { success: false as const, error: "파싱된 데이터가 없습니다" };
  }

  await prisma.resume.update({
    where: { id },
    data: { status: "GENERATING" },
  });

  try {
    const generated = await generateOptimizedResume(
      existing.parsedData as unknown as ResumeContent,
      jobDescription
    );

    await prisma.resume.update({
      where: { id },
      data: {
        generatedContent: generated as never,
        status: "COMPLETED",
      },
    });

    revalidatePath(`/resumes/${id}`);
    return { success: true as const };
  } catch (error) {
    await prisma.resume.update({
      where: { id },
      data: { status: "ERROR" },
    });
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "생성에 실패했습니다",
    };
  }
}

// ── Versions ──

export async function getResumeVersions(resumeId: string) {
  const userId = await getAuthUserId();

  const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
  if (!resume || resume.userId !== userId) return [];

  return prisma.resumeVersion.findMany({
    where: { resumeId },
    orderBy: { version: "desc" },
  });
}

export async function restoreVersion(resumeId: string, versionId: string) {
  const userId = await getAuthUserId();

  const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
  if (!resume || resume.userId !== userId) {
    return { success: false as const, error: "권한이 없습니다" };
  }

  const version = await prisma.resumeVersion.findUnique({
    where: { id: versionId },
  });
  if (!version || version.resumeId !== resumeId) {
    return { success: false as const, error: "버전을 찾을 수 없습니다" };
  }

  const latestVersion = await prisma.resumeVersion.findFirst({
    where: { resumeId },
    orderBy: { version: "desc" },
  });

  const newVersion = (latestVersion?.version ?? 0) + 1;

  await prisma.$transaction([
    prisma.resume.update({
      where: { id: resumeId },
      data: { parsedData: version.content as never },
    }),
    prisma.resumeVersion.create({
      data: {
        resumeId,
        version: newVersion,
        content: version.content as never,
        changeNote: `버전 ${version.version}에서 복원`,
      },
    }),
  ]);

  revalidatePath(`/resumes/${resumeId}`);
  return { success: true as const };
}
