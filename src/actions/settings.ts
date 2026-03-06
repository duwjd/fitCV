"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("인증이 필요합니다");
  return session.user.id;
}

export async function getUserSettings() {
  const userId = await getAuthUserId();

  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      return prisma.userSettings.create({
        data: { userId },
      });
    }

    return settings;
  } catch (error) {
    console.error("설정 조회 실패:", error);
    return null;
  }
}

export async function updateSettings(values: {
  emailNotifications?: boolean;
  deadlineReminders?: boolean;
  jobRecommendations?: boolean;
  interviewReminders?: boolean;
  theme?: string;
}) {
  const userId = await getAuthUserId();

  try {
    await prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...values },
      update: values,
    });
  } catch (error) {
    console.error("설정 수정 실패:", error);
    return { success: false, error: "설정 수정에 실패했습니다." };
  }

  revalidatePath("/profile/settings");
  return { success: true };
}

export async function changePassword(values: {
  currentPassword: string;
  newPassword: string;
}) {
  const userId = await getAuthUserId();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "사용자를 찾을 수 없습니다" };
    }

    // If user has a password, verify current password
    if (user.password) {
      const match = await bcrypt.compare(values.currentPassword, user.password);
      if (!match) {
        return { success: false, error: "현재 비밀번호가 올바르지 않습니다" };
      }
    }

    if (values.newPassword.length < 8) {
      return { success: false, error: "비밀번호는 8자 이상이어야 합니다" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    return { success: false, error: "비밀번호 변경에 실패했습니다." };
  }

  revalidatePath("/profile/settings");
  return { success: true };
}

export async function getConnectedAccounts() {
  const userId = await getAuthUserId();

  try {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { provider: true },
    });

    return accounts;
  } catch (error) {
    console.error("연결된 계정 조회 실패:", error);
    return [];
  }
}
