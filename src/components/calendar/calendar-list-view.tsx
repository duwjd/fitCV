"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EVENT_TYPE_LABELS: Record<string, string> = {
  APPLICATION_DEADLINE: "지원 마감",
  INTERVIEW: "면접",
  CAREER_GOAL: "커리어 목표",
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
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  allDay: boolean;
  eventType: string;
  color: string | null;
}

interface Props {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarListView({ events, onEventClick }: Props) {
  // Group events by date
  const grouped = events.reduce<Record<string, CalendarEvent[]>>(
    (acc, event) => {
      const dateKey = new Date(event.startDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    },
    {}
  );

  if (events.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        이 기간에 일정이 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dateLabel, dayEvents]) => (
        <div key={dateLabel}>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            {dateLabel}
          </h3>
          <div className="space-y-2">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    {event.description && (
                      <p className="text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={EVENT_TYPE_VARIANTS[event.eventType] || "outline"}>
                    {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                  </Badge>
                  {!event.allDay && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.startDate).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
