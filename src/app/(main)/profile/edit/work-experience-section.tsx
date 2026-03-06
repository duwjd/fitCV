"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  workExperienceSchema,
  type WorkExperienceInput,
} from "@/lib/validations/profile";
import {
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
} from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
}

interface Props {
  experiences: Experience[];
}

export function WorkExperienceSection({ experiences }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>경력</CardTitle>
        {!adding && (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus className="mr-1 h-4 w-4" /> 추가
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {adding && (
          <ExperienceForm
            onClose={() => setAdding(false)}
          />
        )}

        {experiences.map((exp) =>
          editing === exp.id ? (
            <ExperienceForm
              key={exp.id}
              experience={exp}
              onClose={() => setEditing(null)}
            />
          ) : (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onEdit={() => setEditing(exp.id)}
            />
          )
        )}

        {experiences.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground">
            경력 사항을 추가해주세요.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ExperienceCard({
  experience,
  onEdit,
}: {
  experience: Experience;
  onEdit: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteWorkExperience(experience.id);
      if (result.success) {
        toast.success("삭제되었습니다");
      } else {
        toast.error(result.error || "삭제에 실패했습니다");
      }
    });
  }

  return (
    <div className="flex items-start justify-between rounded-lg border p-4">
      <div>
        <h4 className="text-sm font-medium">{experience.position}</h4>
        <p className="text-sm text-muted-foreground">{experience.company}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(experience.startDate).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
          })}{" "}
          ~{" "}
          {experience.isCurrent
            ? "현재"
            : experience.endDate
              ? new Date(experience.endDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "short",
                })
              : ""}
        </p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ExperienceForm({
  experience,
  onClose,
}: {
  experience?: Experience;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<WorkExperienceInput>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company: experience?.company ?? "",
      position: experience?.position ?? "",
      startDate: experience?.startDate
        ? new Date(experience.startDate).toISOString().split("T")[0]
        : "",
      endDate:
        experience?.endDate
          ? new Date(experience.endDate).toISOString().split("T")[0]
          : "",
      isCurrent: experience?.isCurrent ?? false,
      description: experience?.description ?? "",
    },
  });

  function onSubmit(values: WorkExperienceInput) {
    startTransition(async () => {
      const result = experience
        ? await updateWorkExperience(experience.id, values)
        : await addWorkExperience(values);

      if (result.success) {
        toast.success(experience ? "수정되었습니다" : "추가되었습니다");
        onClose();
      } else {
        toast.error(result.error || "저장에 실패했습니다");
      }
    });
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium">
          {experience ? "경력 수정" : "경력 추가"}
        </h4>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회사명</FormLabel>
                  <FormControl>
                    <Input placeholder="회사명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>직책</FormLabel>
                  <FormControl>
                    <Input placeholder="직책" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>시작일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>종료일</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={form.watch("isCurrent")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="isCurrent"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">현재 재직중</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>업무 내용</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="주요 업무 및 성과를 작성해주세요"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {experience ? "수정" : "추가"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              취소
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
