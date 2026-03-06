import type { Metadata } from "next";
import Link from "next/link";
import { verifyEmail } from "@/actions/auth";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "이메일 인증",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-xl font-bold">유효하지 않은 링크</h1>
        <p className="text-sm text-muted-foreground">
          인증 링크가 올바르지 않습니다.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">로그인으로 이동</Link>
        </Button>
      </div>
    );
  }

  const result = await verifyEmail(token);

  if (result.success) {
    return (
      <div className="w-full max-w-sm text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h1 className="mb-2 text-xl font-bold">이메일 인증 완료</h1>
        <p className="text-sm text-muted-foreground">
          이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">로그인하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm text-center">
      <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
      <h1 className="mb-2 text-xl font-bold">인증 실패</h1>
      <p className="text-sm text-muted-foreground">{result.error}</p>
      <Button asChild className="mt-6">
        <Link href="/login">로그인으로 이동</Link>
      </Button>
    </div>
  );
}
