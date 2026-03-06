"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  careerPreferencesSchema,
  type CareerPreferencesInput,
} from "@/lib/validations/profile";
import { updateCareerPreferences } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2 } from "lucide-react";

interface Props {
  profile: {
    desiredRole?: string | null;
    desiredIndustry?: string | null;
    experienceYears?: number | null;
    educationLevel?: string | null;
    salaryExpectation?: number | null;
    availableFrom?: Date | null;
  } | null;
}

export function CareerPreferencesForm({ profile }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CareerPreferencesInput>({
    resolver: zodResolver(careerPreferencesSchema),
    defaultValues: {
      desiredRole: profile?.desiredRole ?? "",
      desiredIndustry: profile?.desiredIndustry ?? "",
      experienceYears: profile?.experienceYears ?? undefined,
      educationLevel:
        (profile?.educationLevel as CareerPreferencesInput["educationLevel"]) ??
        undefined,
      salaryExpectation: profile?.salaryExpectation ?? undefined,
      availableFrom: profile?.availableFrom
        ? new Date(profile.availableFrom).toISOString().split("T")[0]
        : "",
    },
  });

  function onSubmit(values: CareerPreferencesInput) {
    startTransition(async () => {
      const result = await updateCareerPreferences(values);
      if (result.success) {
        toast.success("희망 직무 정보가 저장되었습니다");
      } else {
        toast.error(result.error || "저장에 실패했습니다");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>희망 직무 / 조건</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="desiredRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>희망 직무</FormLabel>
                    <FormControl>
                      <Input placeholder="프론트엔드 개발자" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredIndustry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>희망 산업</FormLabel>
                    <FormControl>
                      <Input placeholder="IT/소프트웨어" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="experienceYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>경력 연수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="3"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최종 학력</FormLabel>
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
                        <SelectItem value="HIGH_SCHOOL">고등학교</SelectItem>
                        <SelectItem value="ASSOCIATE">전문학사</SelectItem>
                        <SelectItem value="BACHELOR">학사</SelectItem>
                        <SelectItem value="MASTER">석사</SelectItem>
                        <SelectItem value="DOCTORATE">박사</SelectItem>
                        <SelectItem value="OTHER">기타</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="salaryExpectation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>희망 연봉 (만원)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>입사 가능일</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              저장
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
