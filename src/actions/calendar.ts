"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calendarEventSchema } from "@/lib/validations/calendar";

async function getAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("인증이 필요합니다");
  return session.user.id;
}

export async function getCalendarEvents(startDate: Date, endDate: Date) {
  const userId = await getAuthUserId();

  try {
    return await prisma.calendarEvent.findMany({
      where: {
        userId,
        startDate: { lte: endDate },
        OR: [
          { endDate: { gte: startDate } },
          { endDate: null, startDate: { gte: startDate } },
        ],
      },
      orderBy: { startDate: "asc" },
    });
  } catch (error) {
    console.error("캘린더 이벤트 조회 실패:", error);
    return [];
  }
}

export async function getUpcomingEvents(limit = 5) {
  const userId = await getAuthUserId();
  const now = new Date();

  try {
    return await prisma.calendarEvent.findMany({
      where: {
        userId,
        startDate: { gte: now },
      },
      orderBy: { startDate: "asc" },
      take: limit,
    });
  } catch (error) {
    console.error("다가오는 이벤트 조회 실패:", error);
    return [];
  }
}

export async function createCalendarEvent(values: Record<string, unknown>) {
  const userId = await getAuthUserId();
  const validated = calendarEventSchema.safeParse(values);
  if (!validated.success) {
    return { success: false as const, error: validated.error.issues[0].message };
  }

  try {
    await prisma.calendarEvent.create({
      data: {
        userId,
        title: validated.data.title,
        description: validated.data.description || null,
        startDate: new Date(validated.data.startDate),
        endDate: validated.data.endDate
          ? new Date(validated.data.endDate)
          : null,
        allDay: validated.data.allDay,
        eventType: validated.data.eventType,
        color: validated.data.color || null,
      },
    });
  } catch (error) {
    console.error("이벤트 생성 실패:", error);
    return { success: false as const, error: "이벤트 생성에 실패했습니다." };
  }

  revalidatePath("/calendar");
  return { success: true as const };
}

export async function updateCalendarEvent(
  id: string,
  values: Record<string, unknown>
) {
  const userId = await getAuthUserId();
  const validated = calendarEventSchema.safeParse(values);
  if (!validated.success) {
    return { success: false as const, error: validated.error.issues[0].message };
  }

  try {
    const existing = await prisma.calendarEvent.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false as const, error: "권한이 없습니다" };
    }

    await prisma.calendarEvent.update({
      where: { id },
      data: {
        title: validated.data.title,
        description: validated.data.description || null,
        startDate: new Date(validated.data.startDate),
        endDate: validated.data.endDate
          ? new Date(validated.data.endDate)
          : null,
        allDay: validated.data.allDay,
        eventType: validated.data.eventType,
        color: validated.data.color || null,
      },
    });
  } catch (error) {
    console.error("이벤트 수정 실패:", error);
    return { success: false as const, error: "이벤트 수정에 실패했습니다." };
  }

  revalidatePath("/calendar");
  return { success: true as const };
}

export async function deleteCalendarEvent(id: string) {
  const userId = await getAuthUserId();

  try {
    const existing = await prisma.calendarEvent.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false as const, error: "권한이 없습니다" };
    }

    await prisma.calendarEvent.delete({ where: { id } });
  } catch (error) {
    console.error("이벤트 삭제 실패:", error);
    return { success: false as const, error: "이벤트 삭제에 실패했습니다." };
  }

  revalidatePath("/calendar");
  return { success: true as const };
}
