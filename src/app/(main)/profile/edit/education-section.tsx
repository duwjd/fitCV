"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  educationSchema,
  type EducationInput,
} from "@/lib/validations/profile";
import { addEducation, updateEducation, deleteEducation } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

const DEGREE_LABELS: Record<string, string> = {
  HIGH_SCHOOL: "고등학교",
  ASSOCIATE: "전문학사",
  BACHELOR: "학사",
  MASTER: "석사",
  DOCTORATE: "박사",
  OTHER: "기타",
};

interface Education {
  id: string;
  institution: string;
  degree: string | null;
  major: string | null;
  startDate: Date | null;
  endDate: Date | null;
  gpa: number | null;
  description: string | null;
}

interface Props {
  educations: Education[];
}

export function EducationSection({ educations }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>학력</CardTitle>
        {!adding && (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus className="mr-1 h-4 w-4" /> 추가
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {adding && <EducationForm onClose={() => setAdding(false)} />}

        {educations.map((edu) =>
          editing === edu.id ? (
            <EducationForm
              key={edu.id}
              education={edu}
              onClose={() => setEditing(null)}
            />
          ) : (
            <EducationCard
              key={edu.id}
              education={edu}
              onEdit={() => setEditing(edu.id)}
            />
          )
        )}

        {educations.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground">
            학력 정보를 추가해주세요.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function EducationCard({
  education,
  onEdit,
}: {
  education: Education;
  onEdit: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteEducation(education.id);
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
        <h4 className="text-sm font-medium">{education.institution}</h4>
        <p className="text-sm text-muted-foreground">
          {education.degree && DEGREE_LABELS[education.degree]}
          {education.major && ` · ${education.major}`}
        </p>
        {education.gpa && (
          <p className="text-xs text-muted-foreground">
            GPA {education.gpa}
          </p>
        )}
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

function EducationForm({
  education,
  onClose,
}: {
  education?: Education;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: education?.institution ?? "",
      degree:
        (education?.degree as EducationInput["degree"]) ?? undefined,
      major: education?.major ?? "",
      startDate: education?.startDate
        ? new Date(education.startDate).toISOString().split("T")[0]
        : "",
      endDate: education?.endDate
        ? new Date(education.endDate).toISOString().split("T")[0]
        : "",
      gpa: education?.gpa ?? undefined,
      description: education?.description ?? "",
    },
  });

  function onSubmit(values: EducationInput) {
    startTransition(async () => {
      const result = education
        ? await updateEducation(education.id, values)
        : await addEducation(values);

      if (result.success) {
        toast.success(education ? "수정되었습니다" : "추가되었습니다");
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
          {education ? "학력 수정" : "학력 추가"}
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
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>학교명</FormLabel>
                  <FormControl>
                    <Input placeholder="서울대학교" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>학위</FormLabel>
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
                      {Object.entries(DEGREE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전공</FormLabel>
                  <FormControl>
                    <Input placeholder="컴퓨터공학" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GPA</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="4.0"
                      {...field}
                      value={field.value ?? ""}
                    />
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
                  <FormLabel>입학일</FormLabel>
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
                  <FormLabel>졸업일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비고</FormLabel>
                <FormControl>
                  <Textarea placeholder="추가 정보" rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {education ? "수정" : "추가"}
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
