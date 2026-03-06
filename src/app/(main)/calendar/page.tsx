import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { getCalendarEvents } from "@/actions/calendar";
import { CalendarClient } from "./calendar-client";

export const metadata: Metadata = {
  title: "캘린더",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) - 1 : now.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  const events = await getCalendarEvents(startDate, endDate);

  return (
    <div>
      <PageHeader
        title="캘린더"
        description="지원 마감일, 면접, 목표를 한눈에 관리하세요"
      />
      <CalendarClient
        year={year}
        month={month}
        events={JSON.parse(JSON.stringify(events))}
      />
    </div>
  );
}
