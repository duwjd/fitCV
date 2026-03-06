import { z } from "zod";

export const calendarEventSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  startDate: z.string().min(1, "시작일을 입력해주세요"),
  endDate: z.string().optional().or(z.literal("")),
  allDay: z.boolean(),
  eventType: z.enum(["APPLICATION_DEADLINE", "INTERVIEW", "CAREER_GOAL", "CUSTOM"]),
  color: z.string().max(20).optional().or(z.literal("")),
});

export type CalendarEventInput = z.infer<typeof calendarEventSchema>;
