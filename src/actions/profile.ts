"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  basicInfoSchema,
  careerPreferencesSchema,
  linksSchema,
  workExperienceSchema,
  educationSchema,
  certificationSchema,
} from "@/lib/validations/profile";
import type { SkillLevel } from "@/generated/prisma/client";

async function getAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("인증이 필요합니다");
  return session.user.id;
}

export async function getProfile() {
  const userId = await getAuthUserId();

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        skills: { include: { skill: true } },
        educations: { orderBy: { startDate: "desc" } },
        workExperiences: { orderBy: { startDate: "desc" } },
        certifications: { orderBy: { issueDate: "desc" } },
      },
    });

    return profile;
  } catch (error) {
    console.error("프로필 조회 실패:", error);
    return null;
  }
}

export async function updateBasicInfo(values: Record<string, unknown>) {
  const userId = await getAuthUserId();
  const validated = basicInfoSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const data = {
    ...validated.data,
    birthDate: validated.data.birthDate
      ? new Date(validated.data.birthDate)
      : null,
    nameEn: validated.data.nameEn || null,
    phone: validated.data.phone || null,
    address: validated.data.address || null,
    bio: validated.data.bio || null,
  };

  try {
    await prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  } catch (error) {
    console.error("기본정보 수정 실패:", error);
    return { success: false, error: "기본정보 수정에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function updateCareerPreferences(values: Record<string, unknown>) {
  const userId = await getAuthUserId();
  const validated = careerPreferencesSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const data = {
    desiredRole: validated.data.desiredRole || null,
    desiredIndustry: validated.data.desiredIndustry || null,
    experienceYears: validated.data.experienceYears ?? null,
    educationLevel: validated.data.educationLevel ?? null,
    salaryExpectation: validated.data.salaryExpectation ?? null,
    availableFrom: validated.data.availableFrom
      ? new Date(validated.data.availableFrom)
      : null,
  };

  try {
    await prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  } catch (error) {
    console.error("경력 선호 수정 실패:", error);
    return { success: false, error: "경력 선호 수정에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function updateLinks(values: Record<string, unknown>) {
  const userId = await getAuthUserId();
  const validated = linksSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const data = {
    portfolioUrl: validated.data.portfolioUrl || null,
    linkedinUrl: validated.data.linkedinUrl || null,
    githubUrl: validated.data.githubUrl || null,
  };

  try {
    await prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  } catch (error) {
    console.error("링크 수정 실패:", error);
    return { success: false, error: "링크 수정에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

// Work Experience
export async function addWorkExperience(values: Record<string, unknown>) {
  const userId = await getAuthUserId();
  const validated = workExperienceSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    await prisma.workExperience.create({
      data: {
        profileId: profile.id,
        company: validated.data.company,
        position: validated.data.position,
        startDate: new Date(validated.data.startDate),
        endDate: validated.data.endDate ? new Date(validated.data.endDate) : null,
        isCurrent: validated.data.isCurrent,
        description: validated.data.description || null,
      },
    });
  } catch (error) {
    console.error("경력 추가 실패:", error);
    return { success: false, error: "경력 추가에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function updateWorkExperience(
  id: string,
  values: Record<string, unknown>
) {
  const userId = await getAuthUserId();
  const validated = workExperienceSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    // Verify ownership
    const existing = await prisma.workExperience.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!existing || existing.profile.userId !== userId) {
      return { success: false, error: "권한이 없습니다" };
    }

    await prisma.workExperience.update({
      where: { id },
      data: {
        company: validated.data.company,
        position: validated.data.position,
        startDate: new Date(validated.data.startDate),
        endDate: validated.data.endDate ? new Date(validated.data.endDate) : null,
        isCurrent: validated.data.isCurrent,
        description: validated.data.description || null,
      },
    });
  } catch (error) {
    console.error("경력 수정 실패:", error);
    return { success: false, error: "경력 수정에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteWorkExperience(id: string) {
  const userId = await getAuthUserId();

  try {
    const existing = await prisma.workExperience.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!existing || existing.profile.userId !== userId) {
      return { success: false, error: "권한이 없습니다" };
    }

    await prisma.workExperience.delete({ where: { id } });
  } catch (error) {
    console.error("경력 삭제 실패:", error);
    return { success: false, error: "경력 삭제에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

// Education
export async function addEducation(values: Record<string, unknown>) {
  const userId = await getAuthUserId();
  const validated = educationSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    await prisma.education.create({
      data: {
        profileId: profile.id,
        institution: validated.data.institution,
        degree: validated.data.degree ?? null,
        major: validated.data.major || null,
        startDate: validated.data.startDate
          ? new Date(validated.data.startDate)
          : null,
        endDate: validated.data.endDate ? new Date(validated.data.endDate) : null,
        gpa: validated.data.gpa ?? null,
        description: validated.data.description || null,
      },
    });
  } catch (error) {
    console.error("학력 추가 실패:", error);
    return { success: false, error: "학력 추가에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function updateEducation(
  id: string,
  values: Record<string, unknown>
) {
  const userId = await getAuthUserId();
  const validated = educationSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    const existing = await prisma.education.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!existing || existing.profile.userId !== userId) {
      return { success: false, error: "권한이 없습니다" };
    }

    await prisma.education.update({
      where: { id },
      data: {
        institution: validated.data.institution,
        degree: validated.data.degree ?? null,
        major: validated.data.major || null,
        startDate: validated.data.startDate
          ? new Date(validated.data.startDate)
          : null,
        endDate: validated.data.endDate ? new Date(validated.data.endDate) : null,
        gpa: validated.data.gpa ?? null,
        description: validated.data.description || null,
      },
    });
  } catch (error) {
    console.error("학력 수정 실패:", error);
    return { success: false, error: "학력 수정에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteEducation(id: string) {
  const userId = await getAuthUserId();

  try {
    const existing = await prisma.education.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!existing || existing.profile.userId !== userId) {
      return { success: false, error: "권한이 없습니다" };
    }

    await prisma.education.delete({ where: { id } });
  } catch (error) {
    console.error("학력 삭제 실패:", error);
    return { success: false, error: "학력 삭제에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

// Certification
export async function addCertification(values: Record<string, unknown>) {
  const userId = await getAuthUserId();
  const validated = certificationSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    await prisma.certification.create({
      data: {
        profileId: profile.id,
        name: validated.data.name,
        issuer: validated.data.issuer,
        issueDate: validated.data.issueDate
          ? new Date(validated.data.issueDate)
          : null,
        expiryDate: validated.data.expiryDate
          ? new Date(validated.data.expiryDate)
          : null,
        credentialId: validated.data.credentialId || null,
      },
    });
  } catch (error) {
    console.error("자격증 추가 실패:", error);
    return { success: false, error: "자격증 추가에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function updateCertification(
  id: string,
  values: Record<string, unknown>
) {
  const userId = await getAuthUserId();
  const validated = certificationSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    const existing = await prisma.certification.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!existing || existing.profile.userId !== userId) {
      return { success: false, error: "권한이 없습니다" };
    }

    await prisma.certification.update({
      where: { id },
      data: {
        name: validated.data.name,
        issuer: validated.data.issuer,
        issueDate: validated.data.issueDate
          ? new Date(validated.data.issueDate)
          : null,
        expiryDate: validated.data.expiryDate
          ? new Date(validated.data.expiryDate)
          : null,
        credentialId: validated.data.credentialId || null,
      },
    });
  } catch (error) {
    console.error("자격증 수정 실패:", error);
    return { success: false, error: "자격증 수정에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteCertification(id: string) {
  const userId = await getAuthUserId();

  try {
    const existing = await prisma.certification.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!existing || existing.profile.userId !== userId) {
      return { success: false, error: "권한이 없습니다" };
    }

    await prisma.certification.delete({ where: { id } });
  } catch (error) {
    console.error("자격증 삭제 실패:", error);
    return { success: false, error: "자격증 삭제에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

// Skills
export async function addSkill(name: string, level: string) {
  const userId = await getAuthUserId();

  try {
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    // Find or create the skill
    const skill = await prisma.skill.upsert({
      where: { name },
      create: { name },
      update: {},
    });

    // Check if already added
    const existing = await prisma.profileSkill.findUnique({
      where: { profileId_skillId: { profileId: profile.id, skillId: skill.id } },
    });

    if (existing) {
      return { success: false, error: "이미 추가된 스킬입니다" };
    }

    await prisma.profileSkill.create({
      data: {
        profileId: profile.id,
        skillId: skill.id,
        level: level as SkillLevel,
      },
    });
  } catch (error) {
    console.error("스킬 추가 실패:", error);
    return { success: false, error: "스킬 추가에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function removeSkill(profileSkillId: string) {
  const userId = await getAuthUserId();

  try {
    const existing = await prisma.profileSkill.findUnique({
      where: { id: profileSkillId },
      include: { profile: true },
    });
    if (!existing || existing.profile.userId !== userId) {
      return { success: false, error: "권한이 없습니다" };
    }

    await prisma.profileSkill.delete({ where: { id: profileSkillId } });
  } catch (error) {
    console.error("스킬 삭제 실패:", error);
    return { success: false, error: "스킬 삭제에 실패했습니다." };
  }

  revalidatePath("/profile");
  return { success: true };
}
