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

  return prisma.calendarEvent.findMany({
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
}

export async function getUpcomingEvents(limit = 5) {
  const userId = await getAuthUserId();
  const now = new Date();

  return prisma.calendarEvent.findMany({
    where: {
      userId,
      startDate: { gte: now },
    },
    orderBy: { startDate: "asc" },
    take: limit,
  });
}

export async function createCalendarEvent(values: Record<string, unknown>) {
  const userId = await getAuthUserId();
  const validated = calendarEventSchema.safeParse(values);
  if (!validated.success) {
    return { success: false as const, error: validated.error.issues[0].message };
  }

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

  revalidatePath("/calendar");
  return { success: true as const };
}

export async function deleteCalendarEvent(id: string) {
  const userId = await getAuthUserId();

  const existing = await prisma.calendarEvent.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false as const, error: "권한이 없습니다" };
  }

  await prisma.calendarEvent.delete({ where: { id } });

  revalidatePath("/calendar");
  return { success: true as const };
}
