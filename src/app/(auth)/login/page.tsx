import type { Metadata } from "next";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

export const metadata: Metadata = {
  title: "로그인",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">fit.CV에 로그인</h1>
        <p className="text-sm text-muted-foreground">
          소셜 계정으로 간편하게 시작하세요
        </p>
      </div>
      <SocialLoginButtons />
      <p className="mt-6 text-center text-xs text-muted-foreground">
        로그인 시 서비스 이용약관 및 개인정보처리방침에 동의합니다.
      </p>
    </div>
  );
}
