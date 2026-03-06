"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import { requestPasswordReset } from "@/actions/auth";
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
import { Loader2, Mail } from "lucide-react";

export function ResetPasswordForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ResetPasswordInput) {
    setError(null);
    startTransition(async () => {
      const result = await requestPasswordReset(values);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "요청에 실패했습니다");
      }
    });
  }

  if (success) {
    return (
      <div className="text-center">
        <Mail className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-lg font-semibold">이메일을 확인해주세요</h2>
        <p className="text-sm text-muted-foreground">
          입력하신 이메일로 비밀번호 재설정 링크를 보내드렸습니다.
          <br />
          이메일이 오지 않으면 스팸 폴더를 확인해주세요.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="가입한 이메일 주소"
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
          비밀번호 재설정 링크 보내기
        </Button>
      </form>
    </Form>
  );
}
