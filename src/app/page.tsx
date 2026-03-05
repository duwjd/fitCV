import Link from "next/link";
import {
  FileText,
  PenTool,
  MessageSquare,
  Sparkles,
  Briefcase,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Briefcase,
    title: "채용공고 모아보기",
    description: "진행 중인 채용 공고를 한눈에 확인하고, 관심 공고를 저장하세요.",
  },
  {
    icon: FileText,
    title: "AI 이력서 생성",
    description:
      "CV를 업로드하면 AI가 직무에 최적화된 이력서를 자동으로 만들어줍니다.",
  },
  {
    icon: PenTool,
    title: "AI 자기소개서 작성",
    description:
      "지원하는 채용 공고에 맞춰 나만의 자기소개서를 AI가 작성합니다.",
  },
  {
    icon: MessageSquare,
    title: "AI 모의면접",
    description:
      "채용 공고와 직무에 맞는 면접 질문으로 실전처럼 연습하세요.",
  },
  {
    icon: Sparkles,
    title: "맞춤 채용 추천",
    description: "내 경력과 스킬에 딱 맞는 채용 공고를 AI가 추천합니다.",
  },
  {
    icon: TrendingUp,
    title: "커리어 관리",
    description: "지원 현황, 커리어 목표, 역량 분석까지 한곳에서 관리하세요.",
  },
];

const steps = [
  { step: "01", title: "회원가입", description: "소셜 로그인으로 간편하게" },
  { step: "02", title: "이력서 업로드", description: "기존 CV 파일을 등록" },
  { step: "03", title: "AI가 분석", description: "이력서와 역량을 자동 분석" },
  { step: "04", title: "커리어 시작", description: "맞춤 서비스를 바로 이용" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary">
            fit.CV
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <Button asChild>
              <Link href="/login">시작하기</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-brand opacity-5" />
        <div className="mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              AI 기반 커리어 플랫폼
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              당신의 커리어에
              <br />
              <span className="text-primary">딱 맞는 이력서</span>를
              <br />
              AI가 만들어드립니다
            </h1>
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              이력서 생성부터 자기소개서, 모의면접까지.
              <br className="hidden sm:block" />
              fit.CV와 함께 취업 준비를 스마트하게 시작하세요.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/login">
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
                asChild
              >
                <Link href="#features">기능 살펴보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              취업 준비, 이것 하나로 끝
            </h2>
            <p className="text-lg text-muted-foreground">
              AI가 당신의 커리어 전반을 도와드립니다
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              4단계로 시작하세요
            </h2>
            <p className="text-lg text-muted-foreground">
              복잡한 과정 없이 빠르게 시작할 수 있어요
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80">
            fit.CV로 취업 준비 시간을 절반으로 줄이세요
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-8 text-base"
            asChild
          >
            <Link href="/login">
              무료로 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-lg font-bold text-primary">fit.CV</div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 fit.CV. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
