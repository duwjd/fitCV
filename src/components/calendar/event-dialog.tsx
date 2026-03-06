"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calendarEventSchema,
  type CalendarEventInput,
} from "@/lib/validations/calendar";
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/actions/calendar";

const EVENT_TYPES = [
  { value: "APPLICATION_DEADLINE", label: "지원 마감", color: "bg-red-500" },
  { value: "INTERVIEW", label: "면접", color: "bg-blue-500" },
  { value: "CAREER_GOAL", label: "커리어 목표", color: "bg-green-500" },
  { value: "CUSTOM", label: "기타", color: "bg-gray-500" },
] as const;

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
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  defaultDate?: string;
}

export function EventDialog({ open, onClose, event, defaultDate }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CalendarEventInput>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      startDate: event
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : defaultDate
          ? `${defaultDate}T09:00`
          : "",
      endDate: event?.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : "",
      allDay: event?.allDay ?? true,
      eventType:
        (event?.eventType as CalendarEventInput["eventType"]) ?? "CUSTOM",
      color: event?.color ?? "",
    },
  });

  function onSubmit(values: CalendarEventInput) {
    startTransition(async () => {
      const result = event
        ? await updateCalendarEvent(event.id, values)
        : await createCalendarEvent(values);

      if (result.success) {
        toast.success(event ? "일정이 수정되었습니다" : "일정이 추가되었습니다");
        onClose();
      } else {
        toast.error(result.error || "저장에 실패했습니다");
      }
    });
  }

  function handleDelete() {
    if (!event || !confirm("일정을 삭제하시겠습니까?")) return;
    startTransition(async () => {
      const result = await deleteCalendarEvent(event.id);
      if (result.success) {
        toast.success("삭제되었습니다");
        onClose();
      } else {
        toast.error(result.error || "삭제에 실패했습니다");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "일정 수정" : "새 일정"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="일정 제목" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>유형</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시작</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>종료</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="allDay"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">종일</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea placeholder="메모" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              {event && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  삭제
                </Button>
              )}
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  )}
                  {event ? "수정" : "추가"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { EVENT_TYPES };
