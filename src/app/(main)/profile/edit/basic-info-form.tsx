"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { basicInfoSchema, type BasicInfoInput } from "@/lib/validations/profile";
import { updateBasicInfo } from "@/actions/profile";
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
import { Loader2 } from "lucide-react";

interface Props {
  profile: {
    nameKo?: string | null;
    nameEn?: string | null;
    phone?: string | null;
    birthDate?: Date | null;
    gender?: string | null;
    address?: string | null;
    bio?: string | null;
  } | null;
}

export function BasicInfoForm({ profile }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<BasicInfoInput>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      nameKo: profile?.nameKo ?? "",
      nameEn: profile?.nameEn ?? "",
      phone: profile?.phone ?? "",
      birthDate: profile?.birthDate
        ? new Date(profile.birthDate).toISOString().split("T")[0]
        : "",
      gender: (profile?.gender as BasicInfoInput["gender"]) ?? undefined,
      address: profile?.address ?? "",
      bio: profile?.bio ?? "",
    },
  });

  function onSubmit(values: BasicInfoInput) {
    startTransition(async () => {
      const result = await updateBasicInfo(values);
      if (result.success) {
        toast.success("기본 정보가 저장되었습니다");
      } else {
        toast.error(result.error || "저장에 실패했습니다");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>기본 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="nameKo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름 (한국어)</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름 (영문)</FormLabel>
                    <FormControl>
                      <Input placeholder="Gildong Hong" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>휴대폰</FormLabel>
                    <FormControl>
                      <Input placeholder="010-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>생년월일</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>성별</FormLabel>
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
                        <SelectItem value="MALE">남성</SelectItem>
                        <SelectItem value="FEMALE">여성</SelectItem>
                        <SelectItem value="OTHER">기타</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">
                          선택 안함
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>주소</FormLabel>
                    <FormControl>
                      <Input placeholder="서울특별시 강남구" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>자기소개</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="간단한 자기소개를 작성해주세요"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
