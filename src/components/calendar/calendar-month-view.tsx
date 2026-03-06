"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EVENT_TYPE_COLORS: Record<string, string> = {
  APPLICATION_DEADLINE: "bg-red-500",
  INTERVIEW: "bg-blue-500",
  CAREER_GOAL: "bg-green-500",
  CUSTOM: "bg-gray-500",
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

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
  year: number;
  month: number;
  events: CalendarEvent[];
  onDateClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarMonthView({
  year,
  month,
  events,
  onDateClick,
  onEventClick,
}: Props) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const eventsByDate = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const event of events) {
      const d = new Date(event.startDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(event);
      }
    }
    return map;
  }, [events, year, month]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              "py-2 text-center text-xs font-medium text-muted-foreground",
              i === 0 && "text-red-500",
              i === 6 && "text-blue-500"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const dayEvents = day ? eventsByDate.get(day) || [] : [];
          const isToday = isCurrentMonth && day === todayDate;
          const dateStr = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : "";

          return (
            <div
              key={idx}
              className={cn(
                "min-h-[100px] border-b border-r p-1 transition-colors",
                day && "cursor-pointer hover:bg-muted/50",
                !day && "bg-muted/20"
              )}
              onClick={() => day && onDateClick(dateStr)}
            >
              {day && (
                <>
                  <div
                    className={cn(
                      "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isToday && "bg-primary font-bold text-primary-foreground",
                      idx % 7 === 0 && !isToday && "text-red-500",
                      idx % 7 === 6 && !isToday && "text-blue-500"
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="flex cursor-pointer items-center gap-1 rounded px-1 text-xs hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            EVENT_TYPE_COLORS[event.eventType] || "bg-gray-500"
                          )}
                        />
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="px-1 text-xs text-muted-foreground">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
