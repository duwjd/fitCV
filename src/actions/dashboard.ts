"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAuthUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("인증이 필요합니다");
  return session.user.id;
}

export async function getDashboardStats() {
  const userId = await getAuthUserId();

  const [resumeCount, applicationCount, interviewCount, coverLetterCount] =
    await Promise.all([
      prisma.resume.count({ where: { userId } }),
      prisma.application.count({ where: { userId } }),
      prisma.mockInterview.count({ where: { userId } }),
      prisma.coverLetter.count({ where: { userId } }),
    ]);

  // Most recent resume update
  const latestResume = await prisma.resume.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { updatedAt: true },
  });

  // Application status summary
  const applicationsByStatus = await prisma.application.groupBy({
    by: ["status"],
    where: { userId },
    _count: true,
  });

  // Average interview score
  const interviews = await prisma.mockInterview.findMany({
    where: { userId, status: "COMPLETED" },
    select: { overallScore: true },
  });
  const avgScore =
    interviews.length > 0
      ? Math.round(
          interviews.reduce((sum, i) => sum + (i.overallScore ?? 0), 0) /
            interviews.length
        )
      : null;

  // Nearest upcoming event (D-day)
  const now = new Date();
  const nearestEvent = await prisma.calendarEvent.findFirst({
    where: { userId, startDate: { gt: now } },
    orderBy: { startDate: "asc" },
    select: { title: true, startDate: true, eventType: true },
  });

  const dDay = nearestEvent
    ? Math.ceil(
        (nearestEvent.startDate.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return {
    resumeCount,
    applicationCount,
    interviewCount,
    coverLetterCount,
    latestResumeDate: latestResume?.updatedAt ?? null,
    applicationsByStatus: applicationsByStatus.map((a) => ({
      status: a.status,
      count: a._count,
    })),
    avgInterviewScore: avgScore,
    dDay: nearestEvent
      ? { title: nearestEvent.title, days: dDay!, eventType: nearestEvent.eventType }
      : null,
  };
}

export async function getUpcomingDashboardEvents() {
  const userId = await getAuthUserId();
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return prisma.calendarEvent.findMany({
    where: {
      userId,
      startDate: { gte: now, lte: thirtyDaysLater },
    },
    orderBy: { startDate: "asc" },
    take: 5,
  });
}

export async function getApplicationPipeline() {
  const userId = await getAuthUserId();

  const pipeline = await prisma.application.groupBy({
    by: ["status"],
    where: { userId },
    _count: true,
  });

  return pipeline.map((p) => ({
    status: p.status,
    count: p._count,
  }));
}

export async function getRecentActivity() {
  const userId = await getAuthUserId();

  const [resumes, applications, interviews, coverLetters] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.application.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, status: true, updatedAt: true, jobPosting: { select: { title: true } } },
    }),
    prisma.mockInterview.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, interviewType: true, updatedAt: true },
    }),
    prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, title: true, updatedAt: true },
    }),
  ]);

  type Activity = { type: string; title: string; date: Date; href: string };
  const activities: Activity[] = [
    ...resumes.map((r) => ({
      type: "이력서",
      title: r.title,
      date: r.updatedAt,
      href: `/resumes/${r.id}`,
    })),
    ...applications.map((a) => ({
      type: "지원",
      title: a.jobPosting?.title ?? "지원",
      date: a.updatedAt,
      href: `/jobs`,
    })),
    ...interviews.map((i) => ({
      type: "모의면접",
      title: i.interviewType,
      date: i.updatedAt,
      href: `/interviews`,
    })),
    ...coverLetters.map((c) => ({
      type: "자기소개서",
      title: c.title ?? "자기소개서",
      date: c.updatedAt,
      href: `/cover-letters`,
    })),
  ];

  return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
}

export async function getCareerGoals() {
  const userId = await getAuthUserId();

  return prisma.careerGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export async function toggleCareerGoal(goalId: string) {
  const userId = await getAuthUserId();

  const goal = await prisma.careerGoal.findUnique({ where: { id: goalId } });
  if (!goal || goal.userId !== userId) {
    return { success: false as const, error: "권한이 없습니다" };
  }

  await prisma.careerGoal.update({
    where: { id: goalId },
    data: { isCompleted: !goal.isCompleted },
  });

  return { success: true as const };
}
