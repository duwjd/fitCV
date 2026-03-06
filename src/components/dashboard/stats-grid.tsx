import Link from "next/link";
import { FileText, PenTool, MessageSquare, Briefcase, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  resumeCount: number;
  applicationCount: number;
  interviewCount: number;
  coverLetterCount: number;
  latestResumeDate: Date | null;
  avgInterviewScore: number | null;
  dDay: { title: string; days: number; eventType: string } | null;
}

export function StatsGrid({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "이력서",
      value: stats.resumeCount,
      sub: stats.latestResumeDate
        ? `최근: ${new Date(stats.latestResumeDate).toLocaleDateString("ko-KR")}`
        : null,
      icon: FileText,
      href: "/resumes",
    },
    {
      label: "지원현황",
      value: stats.applicationCount,
      sub: null,
      icon: Briefcase,
      href: "/jobs",
    },
    {
      label: "모의면접",
      value: stats.interviewCount,
      sub: stats.avgInterviewScore != null ? `평균 ${stats.avgInterviewScore}점` : null,
      icon: MessageSquare,
      href: "/interviews",
    },
    {
      label: "D-Day",
      value: stats.dDay ? `D-${stats.dDay.days}` : "-",
      sub: stats.dDay?.title ?? "예정 일정 없음",
      icon: Calendar,
      href: "/calendar",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.label} href={card.href}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.sub && (
                <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
