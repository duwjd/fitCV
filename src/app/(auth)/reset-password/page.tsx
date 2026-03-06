import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "비밀번호 찾기",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">비밀번호 찾기</h1>
        <p className="text-sm text-muted-foreground">
          가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>

      <ResetPasswordForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
