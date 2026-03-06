import type { Metadata } from "next";
import { Suspense } from "react";
import { NewPasswordForm } from "@/components/auth/new-password-form";

export const metadata: Metadata = {
  title: "비밀번호 재설정",
};

export default function NewPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">새 비밀번호 설정</h1>
        <p className="text-sm text-muted-foreground">
          새로운 비밀번호를 입력해주세요.
        </p>
      </div>

      <Suspense>
        <NewPasswordForm />
      </Suspense>
    </div>
  );
}
