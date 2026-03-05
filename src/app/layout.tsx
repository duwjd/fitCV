import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "fit.CV — AI 커리어 플랫폼",
    template: "%s | fit.CV",
  },
  description:
    "AI 기반 커리어 관리 플랫폼 — 이력서 생성, 자기소개서 작성, 모의면접까지",
  openGraph: {
    title: "fit.CV — AI 커리어 플랫폼",
    description:
      "AI 기반 커리어 관리 플랫폼 — 이력서 생성, 자기소개서 작성, 모의면접까지",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
