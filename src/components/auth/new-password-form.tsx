"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema, type NewPasswordInput } from "@/lib/validations/auth";
import { resetPassword } from "@/actions/auth";
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
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: NewPasswordInput) {
    if (!token) return;
    setError(null);
    startTransition(async () => {
      const result = await resetPassword({
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "비밀번호 변경에 실패했습니다");
      }
    });
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-destructive">유효하지 않은 링크입니다.</p>
        <Button asChild className="mt-4">
          <Link href="/reset-password">다시 시도</Link>
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h2 className="mb-2 text-lg font-semibold">비밀번호가 변경되었습니다</h2>
        <p className="text-sm text-muted-foreground">
          새 비밀번호로 로그인해주세요.
        </p>
        <Button asChild className="mt-4">
          <Link href="/login">로그인하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="8자 이상, 영문 + 숫자"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="비밀번호 다시 입력"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          비밀번호 변경
        </Button>
      </form>
    </Form>
  );
}
