import Link from "next/link";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EVENT_TYPE_LABELS: Record<string, string> = {
  APPLICATION_DEADLINE: "마감",
  INTERVIEW: "면접",
  CAREER_GOAL: "목표",
  CUSTOM: "기타",
};

const EVENT_TYPE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  APPLICATION_DEADLINE: "destructive",
  INTERVIEW: "default",
  CAREER_GOAL: "secondary",
  CUSTOM: "outline",
};

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  eventType: string;
}

export function UpcomingEvents({ events }: { events: CalendarEvent[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">다가오는 일정</CardTitle>
        <Link
          href="/calendar"
          className="text-xs text-muted-foreground hover:underline"
        >
          전체 보기
        </Link>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => {
              const date = new Date(event.startDate);
              const now = new Date();
              const daysLeft = Math.ceil(
                (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={EVENT_TYPE_VARIANTS[event.eventType] || "outline"}>
                      {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                    </Badge>
                    <span className="text-sm">{event.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {daysLeft === 0
                      ? "오늘"
                      : daysLeft === 1
                        ? "내일"
                        : `${daysLeft}일 후`}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <Calendar className="mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              다가오는 일정이 없습니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
