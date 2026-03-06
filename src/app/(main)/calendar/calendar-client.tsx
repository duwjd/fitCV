"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarMonthView } from "@/components/calendar/calendar-month-view";
import { CalendarListView } from "@/components/calendar/calendar-list-view";
import { EventDialog } from "@/components/calendar/event-dialog";

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
}

export function CalendarClient({ year, month, events }: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const monthLabel = `${year}년 ${month + 1}월`;

  function navigateMonth(offset: number) {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    router.push(`/calendar?year=${newYear}&month=${newMonth + 1}`);
  }

  function goToday() {
    const now = new Date();
    router.push(
      `/calendar?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
    );
  }

  function handleDateClick(date: string) {
    setSelectedEvent(undefined);
    setSelectedDate(date);
    setDialogOpen(true);
  }

  function handleEventClick(event: CalendarEvent) {
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setDialogOpen(false);
    setSelectedEvent(undefined);
    setSelectedDate(undefined);
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="min-w-[120px] text-center text-lg font-semibold">
            {monthLabel}
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToday}>
            오늘
          </Button>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setSelectedEvent(undefined);
            setSelectedDate(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-1 h-4 w-4" />
          일정 추가
        </Button>
      </div>

      <Tabs defaultValue="month">
        <TabsList>
          <TabsTrigger value="month">월간</TabsTrigger>
          <TabsTrigger value="list">목록</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-4">
          <div className="rounded-lg border">
            <CalendarMonthView
              year={year}
              month={month}
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <CalendarListView
            events={events}
            onEventClick={handleEventClick}
          />
        </TabsContent>
      </Tabs>

      <EventDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        event={selectedEvent}
        defaultDate={selectedDate}
      />
    </>
  );
}
