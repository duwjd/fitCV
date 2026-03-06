import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "로그인",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">fit.CV에 로그인</h1>
        <p className="text-sm text-muted-foreground">
          이메일 또는 소셜 계정으로 로그인하세요
        </p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">또는</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButtons />

      <div className="mt-6 space-y-2 text-center text-sm">
        <p>
          <Link
            href="/reset-password"
            className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </p>
        <p className="text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        로그인 시 서비스 이용약관 및 개인정보처리방침에 동의합니다.
      </p>
    </div>
  );
}
