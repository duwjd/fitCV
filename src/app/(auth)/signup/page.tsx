import type { Metadata } from "next";
import Link from "next/link";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">fit.CV 회원가입</h1>
        <p className="text-sm text-muted-foreground">
          AI 기반 커리어 관리를 시작하세요
        </p>
      </div>

      <SignupForm />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">또는</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButtons />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}
