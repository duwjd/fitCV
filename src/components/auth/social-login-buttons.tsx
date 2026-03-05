"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

const providers = [
  {
    id: "naver",
    name: "네이버로 시작하기",
    className: "bg-[#03C75A] text-white hover:bg-[#02b351]",
    logo: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
      </svg>
    ),
  },
  {
    id: "kakao",
    name: "카카오로 시작하기",
    className: "bg-[#FEE500] text-[#191919] hover:bg-[#e6cf00]",
    logo: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.72 1.775 5.108 4.453 6.467-.145.536-.933 3.45-.964 3.667 0 0-.02.166.088.229.108.063.235.03.235.03.31-.043 3.592-2.35 4.157-2.74.658.092 1.337.14 2.031.14 5.523 0 10-3.463 10-7.793S17.523 3 12 3" />
      </svg>
    ),
  },
  {
    id: "google",
    name: "Google로 시작하기",
    className:
      "border bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700",
    logo: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
];

export function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant="ghost"
          className={`h-12 w-full justify-center gap-3 text-sm font-medium ${provider.className}`}
          onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
        >
          {provider.logo}
          {provider.name}
        </Button>
      ))}
    </div>
  );
}
